import * as express from "express";
import * as serveStatic from "serve-static";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as expressSession from "express-session";
import * as passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { get_auth_function } from "@wildboar/x500-auth";
import { BER } from "asn1-ts/dist/node/functional";
import type {
    CountryName,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/CountryName.ta";
import type {
    UnboundedDirectoryString,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/UnboundedDirectoryString.ta";
import {
    EntryInformation,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation.ta";
import {
    AttributeTypeAndValue,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta";
import type {
    RelativeDistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/RelativeDistinguishedName.ta";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import type {
    Name,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Name.ta";
import {
    countryName,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/countryName.oa";
import {
    stateOrProvinceName,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/stateOrProvinceName.oa";
import {
    localityName,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/localityName.oa";
import {
    uid,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/uid.oa";
import {
    commonName,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
import {
    telephoneNumber,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/telephoneNumber.oa";
import {
    postalAddress,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/postalAddress.oa";
import { AttributeValueAssertion } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeValueAssertion.ta";
import { directoryStringToString } from "@wildboar/x500";
import { engine } from 'express-handlebars';
import {
    DirectoryBindArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/DirectoryBindArgument.ta";
import { id_ac_directoryAccessAC } from "@wildboar/x500/src/lib/modules/DirectoryOSIProtocols/id-ac-directoryAccessAC.va";
import { SimpleCredentials } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SimpleCredentials.ta";
import { TRUE_BIT } from "asn1-ts";
import { Attribute } from "@wildboar/pki-stub/src/lib/modules/InformationFramework/Attribute.ta";

const us_str: CountryName = "US";
const gb_str: CountryName = "GB";
const fl_str: UnboundedDirectoryString = {
    uTF8String: "FL",
};
const hil_str: UnboundedDirectoryString = {
    uTF8String: "HIL",
};
const tampa_str: UnboundedDirectoryString = {
    uTF8String: "Tampa",
};
const westchase_str: UnboundedDirectoryString = {
    uTF8String: "Westchase",
};
const yn_str: UnboundedDirectoryString = {
    uTF8String: "Yorkshire and the Humber",
};
const admin_str: UnboundedDirectoryString = {
    uTF8String: "admin",
};
const us_rdn: RelativeDistinguishedName = [
    new AttributeTypeAndValue(
        countryName["&id"],
        countryName.encoderFor["&Type"]!(us_str, BER),
    ),
];
const gb_rdn: RelativeDistinguishedName = [
    new AttributeTypeAndValue(
        countryName["&id"],
        countryName.encoderFor["&Type"]!(gb_str, BER),
    ),
];
const fl_rdn: RelativeDistinguishedName = [
    new AttributeTypeAndValue(
        stateOrProvinceName["&id"],
        stateOrProvinceName.encoderFor["&Type"]!(fl_str, BER),
    ),
];
const hil_rdn: RelativeDistinguishedName = [
    new AttributeTypeAndValue(
        localityName["&id"],
        localityName.encoderFor["&Type"]!(hil_str, BER),
    ),
];
const tampa_rdn: RelativeDistinguishedName = [
    new AttributeTypeAndValue(
        localityName["&id"],
        localityName.encoderFor["&Type"]!(tampa_str, BER),
    ),
];
const westchase_rdn: RelativeDistinguishedName = [
    new AttributeTypeAndValue(
        localityName["&id"],
        localityName.encoderFor["&Type"]!(westchase_str, BER),
    ),
];
const yh_rdn: RelativeDistinguishedName = [
    new AttributeTypeAndValue(
        localityName["&id"],
        localityName.encoderFor["&Type"]!(yn_str, BER),
    ),
];
const admin_rdn: RelativeDistinguishedName = [
    new AttributeTypeAndValue(
        commonName["&id"],
        commonName.encoderFor["&Type"]!(admin_str, BER),
    ),
];
const admin_dn: DistinguishedName = [
    admin_rdn,
];
const search_base_dn_us: DistinguishedName = [
    us_rdn,
    fl_rdn,
    hil_rdn,
    tampa_rdn,
    westchase_rdn,
];
const search_base_name_us: Name = {
    rdnSequence: search_base_dn_us,
};
// c=GB,l=Yorkshire and the Humber
const search_base_dn_gb: DistinguishedName = [
    gb_rdn,
    yh_rdn,
];
const search_base_name_gb: Name = {
    rdnSequence: search_base_dn_gb,
};

const sessions: Record<string, any> = {};

passport.serializeUser(function(user, cb) {
    const id: string = (user as any).uid;
    sessions[id] = user;
    process.nextTick(function() {
        cb(null, id ?? "");
    });
  });

passport.deserializeUser(function(id, cb) {
    process.nextTick(function() {
        return cb(null, sessions[id as string]);
    });
});

export
async function main () {
    const app = express();
    app.engine("handlebars", engine());
    app.set("view engine", '.hbs');
    app.set("views", __dirname + "/assets");
    app.use(serveStatic(__dirname + "/assets"));
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(expressSession({
        // This is just an example app. You need to change to a configurable secret
        // if you plan on using this in a real production app.
        secret: '7d95be70-5f51-496b-b0e1-3b94237cf4d5',
        resave: true,
        saveUninitialized: true,
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    const [ initial_bind, x500AuthFunction ] = get_auth_function({
        log: console.log,
        url: "idm://dsa01.root.mkdemo.wildboar.software:4632",

        // Step 1: We bind to the directory.
        bind_as: async () => ({
            protocol_id: id_ac_directoryAccessAC,
            timeout: 15000,
            parameter: new DirectoryBindArgument(
                {
                    simple: new SimpleCredentials(
                        admin_dn,
                        undefined,
                        {
                            unprotected: Buffer.from("asdf", "utf-8"),
                        },
                    ),
                },
                new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT ]),
            ),
        }),

        // Step 2: We convert an asserted username to a search operation.
        username_to_dn_or_search: async (username: string) => ({
            baseObject: search_base_name_us,
            subset: "level",
            filter: {
                item: {
                    equality: new AttributeValueAssertion(
                        uid["&id"],
                        uid.encoderFor["&Type"]!({
                            uTF8String: username,
                        }, BER),
                    ),
                },
            },
            sizeLimit: 1,
            copyShallDo: true,
            dontMatchFriends: true,
            noSubtypeMatch: true,
            preferChaining: true,
            requestSignedResult: true,
            requestSignedError: true,
            searchAliases: true,
            searchControls: {
                searchFamily: false,
                searchAliases: true,
            },
            selection: {
                attributes: {
                    select: [
                        uid["&id"],
                        commonName["&id"],
                        telephoneNumber["&id"],
                        postalAddress["&id"],
                    ],
                },
            },
            subentries: false,
            timeLimit: 15, // FIXME:
        }),

        // Step 3: Use the compare operation to assert the password.
        substrategy: { compare: {} },

        // Step 4: Convert a foundentry to user information.
        entry_to_user: async (entry: EntryInformation) => {
            const attributes = entry.information
                ?.flatMap((info) => "attribute" in info ? [info.attribute] : []);
            const uidAttr = attributes?.find((a) => a.type_.isEqualTo(uid["&id"]));
            const uidValue0 = uidAttr?.values[0];
            if (!uidValue0) {
                return {};
            }
            const phone = attributes
                ?.find((a) => a.type_.isEqualTo(telephoneNumber["&id"]))
                ?.values[0]?.printableString;
            const address: string[] | undefined = attributes
                ?.find((a) => a.type_.isEqualTo(postalAddress["&id"]))
                ?.values[0]?.sequence.map((e) => e.utf8String);
            const uidValue: string = directoryStringToString(uid.decoderFor["&Type"]!(uidValue0));
            return {
                uid: uidValue,
                phone,
                address,
            };
        },

        timeout_ms: 15000,
    });
    const bind_outcome = await initial_bind;
    if (!("result" in bind_outcome)) {
        console.error(bind_outcome);
        throw new Error("Could not bind to directory!");
    }
    passport.use(new LocalStrategy(x500AuthFunction));

    app.get('/', (req, res) => {
        res.render('index');
    });
    /**
     * This route is not protected. The point of it is just to display the
     * username once the user is authenticated via the /login route.
     */
    app.get('/success',
        (req, res) => {
            console.log("UID is:", req.query["uid"]);
            res.render('success', {
                uid: req.query["uid"],
                phone: req.query["phone"],
            });
        });
    app.get('/failure', (req, res) => {
        res.render('failure');
    });
    app.post("/login",
        passport.authenticate('local', { failureRedirect: '/failure' }),
        (req, res) => {
            res.redirect(`/success?uid=${req.user?.["uid"]}&phone=${req.user?.["phone"]}`);
        });

    const port = 3001;
    app.listen(port, () => {
        console.log(`Listening on port ${port}.`);
    });
}

export default main;

main();
