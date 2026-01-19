EAPI=8

DESCRIPTION="Meerkat X.500 Directory System Agent (DSA) and LDAP server"
HOMEPAGE="https://wildboar-software.github.io/directory/"
SRC_URI="https://github.com/Wildboar-Software/directory/archive/refs/tags/v${PV}.tar.gz"

LICENSE="MIT"
SLOT="0"
KEYWORDS="~amd64"
IUSE="systemd"

# Needed for building the sqlite add-on
BDEPEND="sys-devel/gcc sys-devel/make python"
RDEPEND="net-libs/nodejs"

# S is the directory where you cd into prior to each step
# WORKDIR is defined by portage: the virtual root where your package is built
S="${WORKDIR}"

src_unpack() {
	default
}

src_compile() {
	npm ci --no-audit --no-fund --no-save || die
	npx nx \
        --tuiAutoExit=true \
        --outputStyle=static \
        run meerkat:build \
        --skipNxCache \
        --skipRemoteCache \
        --skip-nx-cache \
        --verbose || die
    cd dist/apps/meerkat || die
    npm ci --omit=dev --no-audit --no-fund --no-save || die
	npm install --no-package-lock --no-fund --no-audit --no-save prisma@7.0.1 || die
}

pkg_preinst() {
	enewgroup meerkat
	enewuser meerkat -1 -1 /var/lib/meerkat meerkat
}

src_install() {
	insinto /usr/lib/meerkat
	doins -r dist/apps/meerkat/*
    doins dist/apps/meerkat/prisma/prisma.config.ts
	newbin "${S}/pkg/meerkat" /usr/bin/meerkat
	insinto /etc/meerkat
	newins "${S}/pkg/meerkat.env" meerkat.env
	keepdir /var/lib/meerkat
	newinitd pkg/meerkat.initd meerkat-dsa
	newconfd pkg/meerkat.confd meerkat-dsa
	if use systemd; then
		systemd_dounit pkg/meerkat.service
	fi
	keepdir /var/log/meerkat
	fowners meerkat:meerkat /var/log/meerkat
	doman doc/man/man1/meerkat-dsa.1
	doman doc/man/man5/meerkat.env.5
}

pkg_postinst() {
	einfo "Edit /etc/meerkat/meerkat.env before starting Meerkat DSA"
	einfo "Enable with: rc-update add meerkat-dsa default"
}
