# I tried to comply with the Fedora guidelines for NodeJS apps described here:
# https://docs.fedoraproject.org/en-US/packaging-guidelines/Node.js/
# ...but I think those procedures simply aren't applicable, since this package
# lives in a monorepo and requires a double-install of node_modules. Also,
# several aspects of those guidelines seemed to be inapplicable when I went to
# use them.
%global debug_package %{nil}

Name:           meerkat-dsa
Version:        4.0.0
Release:        1%{?dist}
Summary:        Meerkat X.500 Directory System Agent (DSA) / LDAP Server
License:        MIT
URL:            https://wildboar-software.github.io/directory/
Source0:        %{name}-%{version}.tar.gz
Requires:       nodejs >= 21
BuildRequires:  systemd-rpm-macros
BuildRequires:  nodejs-devel
ExclusiveArch:  %{nodejs_arches}

%description
Meerkat DSA is an X.500 Directory System Agent (DSA) created by Wildboar
Software, which includes full support for the Directory Access Protocol (DAP),
Directory System Protocol (DSP), Directory Operational Binding Management
Protocol (DOP), and Lightweight Directory Access Protocol (LDAP). The X.500
protocols named above (everything except LDAP) are transported over IDM
transport as described in ITU Recommendation X.519. Meerkat DSA also serves
a lightweight web administration console for managing your directory.

%prep
%autosetup -n %{name}-%{version}

%build
npm ci --no-audit --no-fund --no-save
npx nx --tuiAutoExit=true --outputStyle=static run meerkat:build --skipNxCache --skipRemoteCache --skip-nx-cache --verbose
cd dist/apps/meerkat
npm ci --omit=dev --no-audit --no-fund --no-save
npm install --no-package-lock --no-audit --no-save prisma@7.0.1

%install
rm -rf %{buildroot}

# Application files
install -d %{buildroot}%{_exec_prefix}/lib/meerkat
cp -r dist/apps/meerkat %{buildroot}%{_exec_prefix}/lib
install -m 0755 dist/apps/meerkat/prisma/prisma.config.ts %{buildroot}%{_exec_prefix}/lib/meerkat
install -d %{buildroot}%{_bindir}
install -m 0755 /src/pkg/meerkat %{buildroot}%{_bindir}/meerkat
install -d %{buildroot}%{_sysconfdir}/meerkat
install -m 0640 /src/pkg/meerkat.env %{buildroot}%{_sysconfdir}/meerkat/meerkat.env
install -d %{buildroot}%{_sharedstatedir}/meerkat
install -d %{buildroot}%{_localstatedir}/log/meerkat
install -d %{buildroot}%{_exec_prefix}/lib/systemd/system
install -m 0644 /src/pkg/meerkat.service \
  %{buildroot}%{_exec_prefix}/lib/systemd/system/meerkat.service
install -d %{buildroot}%{_mandir}/man1
install -d %{buildroot}%{_mandir}/man5
install -Dp -m 0644 /src/doc/man/man1/meerkat-dsa.1 %{buildroot}%{_mandir}/man1/meerkat-dsa.1
install -Dp -m 0644 /src/doc/man/man5/meerkat.env.5 %{buildroot}%{_mandir}/man5/meerkat.env.5

%pre
getent group meerkat >/dev/null || groupadd -r meerkat
getent passwd meerkat >/dev/null || \
  useradd -r -g meerkat -d /var/lib/meerkat -s /sbin/nologin meerkat
exit 0

%post
%systemd_post meerkat.service

%preun
%systemd_preun meerkat.service

%postun
%systemd_postun_with_restart meerkat.service

%files
%license LICENSE.txt
%doc README.md
%doc %{_mandir}/man1/meerkat-dsa.1*
%doc %{_mandir}/man5/meerkat.env.5*
%config(noreplace) %{_sysconfdir}/meerkat/meerkat.env
%{_bindir}/meerkat
%{_exec_prefix}/lib/meerkat
%{_sharedstatedir}/meerkat
%dir %{_localstatedir}/log/meerkat
%config(noreplace) %{_exec_prefix}/lib/systemd/system/meerkat.service

%changelog
* Sat Dec 27 2025 Jonathan Wilbur <jonathan@wilbur.space> - 4.0.0-1
- Initial RPM release
