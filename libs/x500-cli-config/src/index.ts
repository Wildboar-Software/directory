import type { JSONSchema6 } from "json-schema";

export
    const KIND: string = "X500ClientConfig";

export
    const schema: JSONSchema6 = {
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
                type: "string",
            },
            kind: {
                type: "string",
                const: KIND,
            },
            metadata: {
                $ref: "#/definitions/Metadata",
            },
            "current-context": {
                type: "string",
            },
            "preference-profiles": {
                type: "array",
                items: {
                    type: "object",
                    additionalProperties: true,
                },
            },
            dsas: {
                type: "array",
                items: {
                    $ref: "#/definitions/ConfigDSA",
                },
            },
            credentials: {
                type: "array",
                items: {
                    $ref: "#/definitions/ConfigCredential",
                },
            },
            contexts: {
                type: "array",
                items: {
                    $ref: "#/definitions/ConfigContext",
                },
            },
        },
        definitions: {
            DistinguishedName: {
                type: "string",
                minLength: 0,
            },
            Metadata: {
                type: "object",
                required: [
                    "name",
                ],
                properties: {
                    name: {
                        type: "string",
                        minLength: 1,
                    },
                    namespace: {
                        type: "string",
                        minLength: 1,
                    },
                    labels: {
                        type: "object",
                        additionalProperties: {
                            type: "string",
                        },
                    },
                    annotations: {
                        type: "object",
                        additionalProperties: {
                            type: "string",
                        },
                    },
                },
                additionalProperties: true,
            },
            ConfigAccessPoint: {
                type: "object",
                required: [
                    "urls",
                ],
                properties: {
                    urls: {
                        type: "array",
                        items: {
                            type: "string",
                            minLength: 3,
                        },
                        minItems: 1,
                    },
                    category: {
                        type: "string",
                        enum: [
                            "master",
                            "shadow",
                            "writeableCopy",
                        ],
                        default: "master",
                    },
                    "disable-start-tls": {
                        type: "boolean",
                        default: false,
                    },
                    "insecure-skip-tls-verify": {
                        type: "boolean",
                        default: false,
                    },
                    "certificate-authority": {
                        type: "string",
                        minLength: 1,
                    },
                },
                additionalProperties: true,
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
                        minLength: 1,
                    },
                    aeTitle: {
                        type: "string",
                    },
                    accessPoints: {
                        type: "array",
                        items: {
                            $ref: "#/definitions/ConfigAccessPoint",
                        },
                        minItems: 1,
                    },
                    tlsCertChain: {
                        type: "string",
                        minLength: 1,
                    },
                    tlsKey: {
                        type: "string",
                        minLength: 1,
                    },
                    ca: {
                        type: "string",
                        minLength: 1,
                    },
                    crl: {
                        type: "string",
                        minLength: 1,
                    },
                },
                additionalProperties: true,
            },
            ConfigCredential: {
                type: "object",
                required: [
                    "name",
                    "credential",
                ],
                properties: {
                    name: {
                        type: "string",
                    },
                    credential: {
                        oneOf: [
                            {
                                $ref: "#/definitions/ConfigSimpleCredentials",
                            },
                            {
                                $ref: "#/definitions/ConfigStrongCredentials",
                            },
                            {
                                $ref: "#/definitions/ConfigSASLCredentials",
                            },
                        ],
                    },
                },
            },
            AlgorithmIdentifier: {
                type: "object",
                required: [
                    "algorithm",
                ],
                properties: {
                    algorithm: {
                        type: "string",
                        minLength: 3,
                    },
                },
                additionalProperties: true,
            },
            ConfigProtectedPassword: {
                type: "object",
                required: [
                    "algorithmIdentifier",
                    "hashValue",
                ],
                properties: {
                    algorithmIdentifier: {
                        $ref: "#/definitions/AlgorithmIdentifier",
                    },
                    hashValue: {
                        type: "string",
                        description: "The hexadecimal-encoded hash of the password.",
                    },
                },
                additionalProperties: true,
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
                                type: "string",
                            },
                        },
                    },
                    {
                        type: "object",
                        required: [
                            "protected",
                        ],
                        properties: {
                            protected: {
                                $ref: "#/definitions/ConfigProtectedPassword",
                            },
                        },
                    },
                ],
            },
            ConfigSimpleCredentials: {
                type: "object",
                required: [
                    "type",
                    "name",
                ],
                properties: {
                    type: {
                        type: "string",
                        enum: ["simple"],
                    },
                    name: {
                        $ref: "#/definitions/DistinguishedName",
                    },
                    password: {
                        $ref: "#/definitions/ConfigPassword",
                    },
                },
                additionalProperties: true,
            },
            ConfigStrongCredentials: {
                type: "object",
                required: [
                    "type",
                ],
                properties: {
                    type: {
                        type: "string",
                        enum: ["strong"],
                    },
                    name: {
                        $ref: "#/definitions/DistinguishedName",
                    },
                    keyPath: {
                        type: "string",
                        minLength: 1,
                    },
                    certPath: {
                        type: "string",
                        minLength: 1,
                    },
                    attrCertPath: {
                        type: "string",
                        minLength: 1,
                    },
                },
                additionalProperties: true,
            },
            ConfigSASLCredentials: {
                type: "object",
                required: [
                    "type",
                ],
                properties: {
                    type: {
                        type: "string",
                        enum: ["sasl"],
                    },
                },
                additionalProperties: true,
            },
            ConfigContext: {
                type: "object",
                required: [
                    "name",
                    "context",
                ],
                properties: {
                    name: {
                        type: "string",
                        minLength: 1,
                    },
                    context: {
                        type: "object",
                        required: [
                            "dsa",
                        ],
                        properties: {
                            dsa: {
                                type: "string",
                                minLength: 1,
                            },
                            credential: {
                                type: "string",
                                minLength: 1,
                            },
                            preferences: {
                                type: "string",
                                minLength: 1,
                            },
                        },
                        additionalProperties: true,
                    },
                },
                additionalProperties: true,
            },
        },
    };

export default schema;

/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * This interface was referenced by `X500ClientConfig`'s JSON-Schema
 * via the `definition` "DistinguishedName".
 */
export type DistinguishedName = string;
/**
 * This interface was referenced by `X500ClientConfig`'s JSON-Schema
 * via the `definition` "ConfigPassword".
 */
export type ConfigPassword =
  | {
      unprotected: string;
      [k: string]: unknown;
    }
  | {
      protected: ConfigProtectedPassword;
      [k: string]: unknown;
    };

/**
 * Configuration file for configuring X.500 directory tools.
 */
export interface X500ClientConfig {
  apiVersion: string;
  kind: "X500ClientConfig";
  metadata: Metadata;
  "current-context"?: string;
  "preference-profiles"?: {
    [k: string]: unknown;
  }[];
  dsas: ConfigDSA[];
  credentials: ConfigCredential[];
  contexts: ConfigContext[];
  [k: string]: unknown;
}
/**
 * This interface was referenced by `X500ClientConfig`'s JSON-Schema
 * via the `definition` "Metadata".
 */
export interface Metadata {
  name: string;
  namespace?: string;
  labels?: {
    [k: string]: string;
  };
  annotations?: {
    [k: string]: string;
  };
  [k: string]: unknown;
}
/**
 * This interface was referenced by `X500ClientConfig`'s JSON-Schema
 * via the `definition` "ConfigDSA".
 */
export interface ConfigDSA {
  name: string;
  aeTitle?: string;
  /**
   * @minItems 1
   */
  accessPoints: [ConfigAccessPoint, ...ConfigAccessPoint[]];
  tlsCertChain?: string;
  tlsKey?: string;
  ca?: string;
  crl?: string;
  [k: string]: unknown;
}
/**
 * This interface was referenced by `X500ClientConfig`'s JSON-Schema
 * via the `definition` "ConfigAccessPoint".
 */
export interface ConfigAccessPoint {
  /**
   * @minItems 1
   */
  urls: [string, ...string[]];
  category?: "master" | "shadow" | "writeableCopy";
  "disable-start-tls"?: boolean;
  "insecure-skip-tls-verify"?: boolean;
  "certificate-authority"?: string;
  [k: string]: unknown;
}
/**
 * This interface was referenced by `X500ClientConfig`'s JSON-Schema
 * via the `definition` "ConfigCredential".
 */
export interface ConfigCredential {
  name: string;
  credential: ConfigSimpleCredentials | ConfigStrongCredentials | ConfigSASLCredentials;
  [k: string]: unknown;
}
/**
 * This interface was referenced by `X500ClientConfig`'s JSON-Schema
 * via the `definition` "ConfigSimpleCredentials".
 */
export interface ConfigSimpleCredentials {
  type: "simple";
  name: DistinguishedName;
  password?: ConfigPassword;
  [k: string]: unknown;
}
/**
 * This interface was referenced by `X500ClientConfig`'s JSON-Schema
 * via the `definition` "ConfigProtectedPassword".
 */
export interface ConfigProtectedPassword {
  algorithmIdentifier: AlgorithmIdentifier;
  /**
   * The hexadecimal-encoded hash of the password.
   */
  hashValue: string;
  [k: string]: unknown;
}
/**
 * This interface was referenced by `X500ClientConfig`'s JSON-Schema
 * via the `definition` "AlgorithmIdentifier".
 */
export interface AlgorithmIdentifier {
  algorithm: string;
  [k: string]: unknown;
}
/**
 * This interface was referenced by `X500ClientConfig`'s JSON-Schema
 * via the `definition` "ConfigStrongCredentials".
 */
export interface ConfigStrongCredentials {
  type: "strong";
  name?: DistinguishedName;
  keyPath?: string;
  certPath?: string;
  attrCertPath?: string;
  [k: string]: unknown;
}
/**
 * This interface was referenced by `X500ClientConfig`'s JSON-Schema
 * via the `definition` "ConfigSASLCredentials".
 */
export interface ConfigSASLCredentials {
  type: "sasl";
  [k: string]: unknown;
}
/**
 * This interface was referenced by `X500ClientConfig`'s JSON-Schema
 * via the `definition` "ConfigContext".
 */
export interface ConfigContext {
  name: string;
  context: {
    dsa: string;
    credential?: string;
    preferences?: string;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}
