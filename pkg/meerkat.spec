# Trying to comply with this: https://docs.fedoraproject.org/en-US/packaging-guidelines/Node.js/
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
# BuildRequires:  node-gyp
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
install -d %{buildroot}/usr/lib/meerkat
cp -a dist package.json %{buildroot}/usr/lib/meerkat/
install -d %{buildroot}/usr/bin
install -m 0755 /src/pkg/meerkat %{buildroot}/usr/bin/meerkat
install -d %{buildroot}/etc/meerkat
install -m 0640 /src/pkg/meerkat.env %{buildroot}/etc/meerkat/meerkat.env
install -d %{buildroot}/var/lib/meerkat
install -d %{buildroot}/var/log/meerkat
install -d %{buildroot}/usr/lib/systemd/system
install -m 0644 /src/pkg/meerkat.service \
  %{buildroot}/usr/lib/systemd/system/meerkat.service

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
%doc doc/man/man1/meerkat-dsa.1
%doc doc/man/man5/meerkat.env.5

/usr/bin/meerkat
/usr/lib/meerkat

%config(noreplace) /etc/meerkat/meerkat.env

/var/lib/meerkat
/var/log/meerkat

/usr/lib/systemd/system/meerkat.service

%changelog
* Sat Dec 27 2025 Jonathan Wilbur <jonathan@wilbur.space> - 4.0.0-1
- Initial RPM release
