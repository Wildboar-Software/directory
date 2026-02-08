{ lib
, stdenv
, nodejs_24
, buildNpmPackage
, fetchFromGitHub
}:

let
  buildStage = buildNpmPackage {
    pname = "meerkat-dsa-build";
    version = "4.0.0";
    src = fetchFromGitHub {
      owner = "Wildboar-Software";
      repo = "directory";
      rev = "v4.0.0-rc1";
      hash = "sha256-n26A/OtmRuMcnrihSl1b+YFKd23EIg2gsXKRC+AZsq8=";
    };
    npmDepsHash = "sha256-eih0APtkKpYzJenDP+xNHkfmQ6ynbO57fXRemaFzEHo=";
    makeCacheWritable = true;
    npmFlags = [ "--no-audit" "--no-fund" "--no-save" "--ignore-scripts" "--verbose" "--legacy-peer-deps" ];
    buildPhase = ''
      npx nx \
        --tuiAutoExit=true \
        --outputStyle=static \
      run meerkat:build \
        --skipNxCache \
        --skipRemoteCache \
        --skip-nx-cache \
        --verbose
    '';
    installPhase = ''
      cp -r dist/apps/meerkat $out
      cp doc/man/man1/meerkat-dsa.1 $out
      cp doc/man/man5/meerkat.env.5 $out
    '';
  };

  runtimeStage = buildNpmPackage {
    pname = "meerkat-dsa";
    version = "4.0.0";
    src = buildStage;
    npmDepsHash = "sha256-uP0+7G8ujB9aG62za4+3t+X6EWaxoGFf/xZZhf/47jw=";
    npmFlags = [ "--no-audit" "--no-fund" "--no-save" "--ignore-scripts" "--verbose" ];
    dontNpmBuild = true;
    installPhase = ''
      mkdir -p $out/lib
      cp -r * $out/lib
      cp prisma/prisma.config.ts $out/lib
      mkdir -p $out/bin
      # This will overwrite the bin that buildNpmPackage creates.
      cat > $out/bin/meerkat <<'EOF'
      #!${stdenv.shell}
      set -euo pipefail

      # If the migration fails, still carry on: we do not want a failed migration
      # (which is infrequently needed to begin with) to make us unable to start
      # Meerkat DSA
      #
      # NOTE: Prisma seems to search for migrations relative to the config file, not
      # the current directory.
      PRISMA_HIDE_UPDATE_MESSAGE=1 ${nodejs_24}/bin/npx prisma migrate deploy \
          --schema @APP_DIR@/lib/prisma/schema.prisma \
          --config @APP_DIR@/lib/prisma.config.ts || true

      exec ${nodejs_24}/bin/node @APP_DIR@/lib/main.js start "$@"
      EOF
      substituteInPlace $out/bin/meerkat --replace "@APP_DIR@" "$out"
      chmod +x $out/bin/meerkat
      mkdir -p $out/share/man/man1
      mkdir -p $out/share/man/man5
      install -m 644 meerkat-dsa.1 $out/share/man/man1/meerkat-dsa.1
      install -m 644 meerkat.env.5 $out/share/man/man5/meerkat.env.5
    '';
    meta = with lib; {
      description = "Meerkat X.500 Directory System Agent (DSA) and LDAP Server";
      license = licenses.mit;
      platforms = platforms.linux;
      mainProgram = "meerkat";
    };
  };
in
runtimeStage
