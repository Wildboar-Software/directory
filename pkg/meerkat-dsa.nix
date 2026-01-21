{ config, lib, pkgs, ... }:

let
  cfg = config.services.meerkat-dsa;
in {
  options.services.meerkat-dsa = {
    enable = lib.mkEnableOption "Meerkat X.500 Directory System Agent (DSA) and LDAP Server";
    dataDir = lib.mkOption {
      type = lib.types.path;
      default = "/var/lib/meerkat";
    };

    environmentFile = lib.mkOption {
      type = lib.types.path;
      default = "/etc/meerkat/meerkat.env";
      description = "Environment file (using .env syntax)";
    };
  };

  config = lib.mkIf cfg.enable {

    system.stateVersion = "26.05";

    users.users.meerkat = {
      isSystemUser = true;
      group = "meerkat";
    };

    users.groups.meerkat = {};

    # Documented here: https://github.com/NixOS/nixos/blob/5f444a4d8d49a497bcfabe2544bda264c845653e/modules/system/boot/systemd-unit-options.nix
    # Example application: https://github.com/DMarby/picsum-photos/blob/a4359f9d85e99aaf11a110590a681510e21130c4/flake.nix#L178
    systemd.services.meerkat-dsa = {
      description = "Meerkat DSA";
      wantedBy = [ "multi-user.target" ];
      after = [ "network.target" ];
      # This seems to be required even though undocumented.
      startLimitBurst = 10;
      # This seems to be required even though undocumented.
      startLimitIntervalSec = 5;
      serviceConfig = {
        Type = "simple";
        User = "meerkat";
        Group = "meerkat";
        ExecStart = "${pkgs.meerkat-dsa}/bin/meerkat";
        Restart = "on-failure";
        RestartSec = "30s";
        WorkingDirectory = cfg.dataDir;
        EnvironmentFile = cfg.environmentFile;
        PassEnvironment = "LANG NO_COLOR";
        NoNewPrivileges = "yes";
        ProtectSystem = "full";
        ProtectHome = "yes";
        ProtectProc = "invisible";
        PrivateTmp = "yes";
        PrivateDevices = "yes";
        PrivateUsers = "self";
        SecureBits = "";
        ProtectClock = "yes";
        ProtectHostname = "yes";
        ProtectKernelModules = "yes";
        ProtectKernelLogs = "yes";
        ProtectControlGroups = "yes";
        RestrictRealtime = "yes";
        PrivateMounts = "yes";
        SystemCallFilter="~@cpu-emuation @chown @debug @keyring @module @mount @obsolete @privileged @reboot @resources @setuid @swap";
        LogNamespace = "meerkat";
      };
      environment = {
        NODE_ENV = "production";
        DATABASE_URL = "file:${cfg.dataDir}/meerkat.db";
        PRISMA_HIDE_UPDATE_MESSAGE = "1";
        MEERKAT_LOG_SYSTEMD_LEVEL_PREFIX = "1";
      };
    };
  };
}
