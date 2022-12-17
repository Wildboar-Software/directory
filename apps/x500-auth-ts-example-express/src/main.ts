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
import { AttributeValueAssertion } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeValueAssertion.ta";
import { userPwd } from "@wildboar/x500/src/lib/modules/PasswordPolicy/userPwd.oa";
import { EntryInformationSelection } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";
import { directoryStringToString } from "@wildboar/x500";
import { engine } from 'express-handlebars';
import {
    DirectoryBindArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/DirectoryBindArgument.ta";
import { id_ac_directoryAccessAC } from "@wildboar/x500/src/lib/modules/DirectoryOSIProtocols/id-ac-directoryAccessAC.va";
import {
    userPassword,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/userPassword.oa";

const us_str: CountryName = "US";
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
const us_rdn: RelativeDistinguishedName = [
    new AttributeTypeAndValue(
        countryName["&id"],
        countryName.encoderFor["&Type"]!(us_str, BER),
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
const search_base_dn: DistinguishedName = [
    us_rdn,
    fl_rdn,
    hil_rdn,
    tampa_rdn,
    westchase_rdn,
];
const search_base_name: Name = {
    rdnSequence: search_base_dn,
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
        substrategy: {
            compare: {
                get_compare_arg: (username: string, password: string) => {
                    const user_rdn: RelativeDistinguishedName = [
                        new AttributeTypeAndValue(
                            commonName["&id"],
                            commonName.encoderFor["&Type"]!({
                                uTF8String: username,
                            }, BER),
                        ),
                    ];
                    const userDirectoryName: Name = {
                        rdnSequence: [
                            ...search_base_dn,
                            user_rdn,
                        ],
                    };
                    return [
                        userDirectoryName,
                        {
                            object: userDirectoryName,
                            purported: new AttributeValueAssertion(
                                userPassword["&id"],
                                userPassword.encoderFor["&Type"]!(Buffer.from(password, "utf-8"), BER),
                            ),
                        },
                    ];
                },
                get_read_arg: (dn: Name) => {
                    console.log("Compare succeeded. Reading entry.");
                    return {
                        object: dn,
                        selection: new EntryInformationSelection(
                            {
                                select: [
                                    uid["&id"],
                                ],
                            },
                        ),
                    };
                },
                entry_to_user: (entry: EntryInformation) => {
                    const attributes = entry.information
                        ?.flatMap((info) => "attribute" in info ? [info.attribute] : []);
                    const uidAttr = attributes?.find((a) => a.type_.isEqualTo(uid["&id"]));
                    const uidValue0 = uidAttr?.values[0];
                    if (!uidValue0) {
                        return {};
                    }
                    const uidValue: string = directoryStringToString(uid.decoderFor["&Type"]!(uidValue0));
                    return {
                        uid: uidValue,
                    };
                },
            },
        },
        bind_as: () => ({
            protocol_id: id_ac_directoryAccessAC,
            parameter: new DirectoryBindArgument(undefined, undefined),
            timeout: 5000,
        }),
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
            });
        });
    app.get('/failure', (req, res) => {
        res.render('failure');
    });
    app.post("/login",
        passport.authenticate('local', { failureRedirect: '/failure' }),
        (req, res) => {
            res.redirect(`/success?uid=${req.user?.["uid"]}`);
        });

    const port = 3001;
    app.listen(port, () => {
        console.log(`Listening on port ${port}.`);
    });
}

export default main;

main();
