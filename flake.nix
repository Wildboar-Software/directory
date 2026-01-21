{
  description = "Meerkat X.500 Directory System Agent (DSA) and LDAP Server";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      systems = [ "x86_64-linux" ];
      forAllSystems = f:
        nixpkgs.lib.genAttrs systems (system:
          f {
            inherit system;
            pkgs = import nixpkgs {
              inherit system;
              overlays = [ self.overlays.default ];
            };
          }
        );
    in {
      packages = forAllSystems ({ pkgs, ... }: {
        default = pkgs.meerkat-dsa;
        meerkat-dsa = pkgs.meerkat-dsa;
      });

      apps = forAllSystems ({ pkgs, ... }: {
        default = {
          type = "app";
          program = "${pkgs.meerkat-dsa}/bin/meerkat-dsa";
        };
      });

      overlays.default = import ./pkg/overlay.nix;
      nixosModules.meerkat-dsa = import ./pkg/meerkat-dsa.nix;
      checks = forAllSystems ({ pkgs, ... }: {
        build = pkgs.meerkat-dsa;
      });
    };
}
