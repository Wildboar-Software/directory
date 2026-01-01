class MeerkatDsa < Formula
    desc "X.500 Directory Server (DSA) and LDAP Server by Wildboar Software"
    homepage "https://github.com/Wildboar-Software/directory"
    # url "https://github.com/Wildboar-Software/directory/archive/refs/tags/v4.0.0.tar.gz"
    url "file:///home/jonathan/repos/directory", using: :git
    version "4.0.0"
    # sha256 :no_check
    sha256 "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    license "MIT"

    depends_on "node"
    depends_on "gcc" => :build

    def install
        (var/"meerkat").mkpath
        (etc/"meerkat").mkpath
        (lib/"meerkat").mkpath
        # TODO: Use std_npm_args
        system "npm", "ci", "--no-audit", "--no-fund", "--no-save"
        system "npx", "nx", "--tuiAutoExit=true", "--outputStyle=static", "run", "meerkat:build", "--skipNxCache", "--skipRemoteCache", "--skip-nx-cache", "--verbose"
        system "cp", "apps/meerkat/src/prisma/prisma.config.ts", "dist/apps/meerkat"
        cd "dist/apps/meerkat" do
            system "npm", "ci", "--omit=dev", "--no-audit", "--no-fund", "--no-save"
            system "npm", "install", "--no-package-lock", "--no-fund", "--no-audit", "--no-save", "prisma@7.0.1"
            (lib/"meerkat").install Dir["*"]
        end
        inreplace "pkg/meerkat.env" do |s|
            s.gsub! "/var/lib/meerkat", var/"meerkat"
        end
        (etc/"meerkat").install "pkg/meerkat.env"
        (buildpath/"meerkat").write <<~INI
            #!/bin/sh
            cd #{lib}/meerkat
            export DOTENV_CONFIG_PATH="#{etc}/meerkat/meerkat.env"
            NODE_OPTIONS="--require dotenv/config" npx prisma migrate deploy \
                --schema ./prisma/schema.prisma \
                --config ./prisma.config.ts || true
            exec node ./main.js start "$@"
        INI
        chmod 0755, (buildpath/"meerkat")
        bin.install (buildpath/"meerkat")
        # libexec.install "meerkat"
        # bin.write_exec_script libexec/"meerkat"
    end

    service do
        name={
            :launchd => "meerkat-dsa",
            :systemd => "meerkat-dsa",
        }
        run [bin/"meerkat"]
        keep_alive true
        restart_delay 30
        working_dir (var/"meerkat")
        environment_variables={
            :NODE_ENV => "production",
            :DOTENV_CONFIG_PATH => etc/"meerkat/meerkat.env",
            :MEERKAT_LOG_SYSTEMD_LEVEL_PREFIX => "1",
            :DATABASE_URL => "file:#{var}/meerkat/meerkat.db",
            # Just to be explicit
            # :LANG => ENV["LANG"],
            # :NO_COLOR => ENV["NO_COLOR"],
            # :LC_MESSAGE => ENV["LC_MESSAGE"],
        }
    end

    # test do
    #     # assert_match "meerkat", shell_output("#{bin}/meerkat --version")
    # end

end
