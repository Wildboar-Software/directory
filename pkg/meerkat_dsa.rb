class MeerkatDsa < Formula
  desc "X.500 Directory Server (DSA) and LDAP Server by Wildboar Software"
  homepage "https://github.com/Wildboar-Software/directory"
  # url "https://github.com/Wildboar-Software/directory/archive/refs/tags/v4.0.0.tar.gz"
  url "file:///home/jonathan/repos/directory", using: :git
  version "4.0.0"
  sha256 "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  license "MIT"

  depends_on "gcc" => :build
  depends_on "node"

  def install
    (var/"meerkat").mkpath
    (etc/"meerkat").mkpath
    (lib/"meerkat").mkpath
    # REVIEW: Do I need to use std_npm_args?
    # I don't feel like that is applicable here. It's not clear what it's
    # for, I don't think it works with npm ci, and I should be running npm
    # ci, not npm install.
    system "npm", "ci", "--no-audit", "--no-fund", "--no-save"
    system(
      "npx",
      "nx",
      "--tuiAutoExit=true",
      "--outputStyle=static",
      "run", "meerkat:build",
      "--skipNxCache",
      "--skipRemoteCache",
      "--skip-nx-cache",
      "--verbose"
    )
    cp "apps/meerkat/src/prisma/prisma.config.ts", "dist/apps/meerkat"
    cd "dist/apps/meerkat" do
      system "npm", "ci", "--omit=dev", "--no-audit", "--no-fund", "--no-save"
      system(
        "npm",
        "install",
        "--no-package-lock",
        "--no-fund",
        "--no-audit",
        "--no-save",
        "prisma@7.0.1",
      )
      (lib/"meerkat").install Dir["*"]
    end
    inreplace "pkg/meerkat.env" do |s|
      s.gsub! "/var/lib/meerkat", var/"meerkat"
    end
    (etc/"meerkat").install "pkg/meerkat.env"
    (buildpath/"meerkat").write <<~SCRIPT
      #!/bin/sh
      # This isn't defined in the service block, so we have to cd here.
      cd #{lib}/meerkat
      # If the migration fails, still carry on: we do not want a failed migration
      # (which is infrequently needed to begin with) to make us unable to start
      # Meerkat DSA
      #
      # NOTE: Prisma seems to search for migrations relative to the config file, not
      # the current directory.
      NODE_OPTIONS="--require dotenv/config" npx prisma migrate deploy \
          --schema ./prisma/schema.prisma \
          --config ./prisma.config.ts || true
      # Replace the current process with the node execution.
      exec node ./main.js start "$@"
    SCRIPT
    bin.install (buildpath/"meerkat")
  end

  def caveats
    <<~EOS
      This has not been tested on MacOS. It has only been tested on Xubuntu
      20.04.

      Database schema migrations occur automatically on startup. Please keep a
      backup of your data found in
      #{var}/meerkat/meerkat.db
      (or elsewhere, if you changed DATABASE_URL).

      Note that the default configuration does not listen on any port at all.
      You presumably do not want an unreachable, unusable X.500 directory. If
      so, configure your DSA in
      #{etc}/meerkat/meerkat.env
      and restart.

      Documentation: https://wildboar-software.github.io/directory/
      Report Issues: https://github.com/Wildboar-Software/directory/issues
    EOS
  end

  service do
    run [opt_bin/"meerkat"]
    keep_alive true
    restart_delay 30
    working_dir (var/"meerkat")
    environment_variables NODE_ENV:                         "production",
                          DOTENV_CONFIG_PATH:               etc/"meerkat/meerkat.env",
                          MEERKAT_LOG_SYSTEMD_LEVEL_PREFIX: "1",
                          DATABASE_URL:                     "file:#{var}/meerkat/meerkat.db"
  end

  test do
    system(
      "npx",
      "nx",
      "--tuiAutoExit=true",
      "--outputStyle=static",
      "run-many",
      "--target=test",
      "--all",
      "--skipNxCache",
      "--skipRemoteCache",
      "--skip-nx-cache",
      "--verbose",
      "--exclude",
      "x500-functional-tests",
    )
  end
end
