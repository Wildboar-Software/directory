"use strict";
exports.__esModule = true;
var KIND = "X500ClientConfig";
var schema = {
    // $id: "",
    $schema: "http://json-schema.org/draft-07/schema#",
    title: KIND,
    description: "Configuration file for configuring X.500 directory tools.",
    type: "object",
    required: [
        "apiVersion",
        "kind",
        "metadata",
        "dsas",
        "credentials",
        "contexts",
    ],
    additionalProperties: true,
    properties: {
        apiVersion: {
            type: "string"
        },
        kind: {
            type: "string",
            "const": KIND
        },
        metadata: {
            $ref: "#/definitions/Metadata"
        },
        "current-context": {
            type: "string"
        },
        preferences: {
            type: "object",
            additionalProperties: true
        },
        dsas: {
            type: "array",
            items: {
                $ref: "#/definitions/ConfigDSA"
            },
            minItems: 1
        },
        credentials: {
            type: "array",
            items: {
                $ref: "#/definitions/ConfigCredential"
            },
            minLength: 0
        },
        contexts: {
            type: "array",
            items: {
                $ref: "#/definitions/ConfigContext"
            },
            minItems: 1
        }
    },
    definitions: {
        DistinguishedName: {
            type: "string",
            minLength: 0
        },
        Metadata: {
            type: "object",
            required: [
                "name",
            ],
            properties: {
                name: {
                    type: "string",
                    minLength: 1
                },
                namespace: {
                    type: "string",
                    minLength: 1
                },
                labels: {
                    type: "object",
                    additionalProperties: {
                        type: "string"
                    }
                },
                annotations: {
                    type: "object",
                    additionalProperties: {
                        type: "string"
                    }
                }
            },
            additionalProperties: true
        },
        ConfigAccessPoint: {
            type: "object",
            required: [
                "url",
            ],
            properties: {
                url: {
                    type: "string",
                    minLength: 3
                },
                category: {
                    type: "string",
                    "enum": [
                        "master",
                        "shadow",
                        "writeableCopy",
                    ],
                    "default": "master"
                },
                "disable-start-tls": {
                    type: "boolean",
                    "default": false
                },
                "insecure-skip-tls-verify": {
                    type: "boolean",
                    "default": false
                },
                "certificate-authority": {
                    type: "string",
                    minLength: 1
                }
            },
            additionalProperties: true
        },
        ConfigDSA: {
            type: "object",
            required: [
                "name",
                "accessPoints",
            ],
            properties: {
                name: {
                    type: "string",
                    minLength: 1
                },
                accessPoints: {
                    type: "array",
                    items: {
                        $ref: "#/definitions/ConfigAccessPoint"
                    },
                    minItems: 1
                }
            },
            additionalProperties: true
        },
        ConfigCredential: {
            type: "object",
            required: [
                "name",
                "credential",
            ],
            properties: {
                name: {
                    type: "string"
                },
                credential: {
                    oneOf: [
                        {
                            $ref: "#/definitions/ConfigSimpleCredentials"
                        },
                        {
                            $ref: "#/definitions/ConfigStrongCredentials"
                        },
                        {
                            $ref: "#/definitions/ConfigSASLCredentials"
                        },
                    ]
                }
            },
            additionalProperties: true
        },
        AlgorithmIdentifier: {
            type: "object",
            required: [
                "algorithm",
            ],
            properties: {
                algorithm: {
                    type: "string",
                    minLength: 3
                }
            },
            additionalProperties: true
        },
        ConfigProtectedPassword: {
            type: "object",
            required: [
                "algorithmIdentifier",
                "hashValue",
            ],
            properties: {
                algorithmIdentifier: {
                    $ref: "#/definitions/AlgorithmIdentifier"
                },
                hashValue: {
                    type: "string",
                    description: "The hexadecimal-encoded hash of the password."
                }
            },
            additionalProperties: true
        },
        ConfigPassword: {
            oneOf: [
                {
                    type: "object",
                    required: [
                        "unprotected",
                    ],
                    properties: {
                        unprotected: {
                            type: "string"
                        }
                    },
                    additionalProperties: true
                },
                {
                    type: "object",
                    required: [
                        "protected",
                    ],
                    properties: {
                        protected: {
                            $ref: "#/definitions/ConfigProtectedPassword"
                        }
                    },
                    additionalProperties: true
                },
            ]
        },
        ConfigSimpleCredentials: {
            type: "object",
            required: [
                "name",
            ],
            properties: {
                name: {
                    $ref: "#/definitions/DistinguishedName"
                },
                password: {
                    $ref: "#/definitions/ConfigPassword"
                }
            },
            additionalProperties: true
        },
        ConfigStrongCredentials: {
            type: "object",
            properties: {
                name: {
                    $ref: "#/definitions/DistinguishedName"
                },
                certPath: {
                    type: "string",
                    minLength: 1
                },
                attrCertPath: {
                    type: "string",
                    minLength: 1
                }
            },
            additionalProperties: true
        },
        ConfigSASLCredentials: {
            type: "object",
            additionalProperties: true
        },
        ConfigContext: {
            type: "object",
            required: [
                "name",
            ],
            properties: {
                name: {
                    type: "string",
                    minLength: 1
                },
                context: {
                    type: "object",
                    required: [
                        "dsa",
                    ],
                    properties: {
                        dsa: {
                            type: "string",
                            minLength: 1
                        },
                        credential: {
                            type: "string",
                            minLength: 1
                        },
                        readOnly: {
                            type: "boolean",
                            "default": false
                        }
                    },
                    additionalProperties: true
                }
            },
            additionalProperties: true
        }
    }
};
exports["default"] = schema;
