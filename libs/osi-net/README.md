# OSI Networking Library

Implementation of the Open Systems Interconnection (OSI) stack of networking
protocols, primarily for use in:

- ISO Transport over TCP (ITOT), as described in [IETF RFC 1006](https://datatracker.ietf.org/doc/html/rfc1006)
- TP4 over IP, as described in [IETF RFC 905](https://www.rfc-editor.org/rfc/rfc905.html)
- X.25 over TCP (XOT), as described in [IETF RFC 1613](https://www.rfc-editor.org/rfc/rfc1613.html)

Currently, only ITOT is implemented, and even then, it is only a minimally
viable implementation. The transport layer only supports TP0, the session layer,
presentation layer, and ACSE only support the kernel functional units. As there
is only a one-to-one mapping of each (N)-entity per (N-1)-entity, this library
does not support routing to (N)-entities via (N)-selectors.

## Minimal Knowledge Needed to use ITOT

First, call `create_itot_stack()` with a TCP socket, and whatever options you
want.

```typescript
const itot = create_itot_stack(socket);
```

Then, from your application-specific code, you can make a call like this:

```typescript
const user_data: User_data = {
    fully_encoded_data: [
        new PDV_list(
            undefined,
            pc.presentation_context_identifier,
            {
                single_ASN1_type: _encode_OsiDirectoryOperation(
                    {
                        request: new OsiReq(
                            params.invoke_id,
                            params.code,
                            params.parameter,
                        ),
                    },
                    BER,
                ),
            },
        ),
    ],
};
dispatch_P_DTreq(itot.presentation, user_data);
```

To send a ROSE operation request using the presentation-layer P-DATA service.

## Architecture

### Individual Protocols

The ITU Recommendations for each protocol used in the stack (e.g. X.224) all
have "state tables" in Annex A. These state tables describe what should happen
to the (N)-entity state when a network event happens. These specifications break
these events into "inbound" and "outbound."

To keep aligned with the specification as much as possible, this library adheres
to these state tables.

Inbound events are represented as `dispatch_*()` functions, where `*` is the
event identifier assigned in Annex A, such as `TDISind` for
`T-DISCONNECT indication`. These dispatch functions take, as their
first argument, the current protocol machine state, and usually a PDU. The
current protocol machine state may be modified by reference. Nothing is returned
from these functions. So for instance, to apply a `P-DATA request` to a
presentation layer, you would call `dispatch_P_DTreq(presentation, data)`.
Under the hood, this would propagate to lower layers (if wired up to do so),
ultimately leading to bytes being sent over the wire.

In keeping with NodeJS programming patterns, outbound events are represented as
a strongly-typed `EventEmitter` (from `node:events`), which is referenced by the
`outboundEvents` property in each protocol machine state. Again, these events
use the identifiers assigned in Annex A of their respective ITU recommendations.
So for instance, if a session protocol machine emitted an outbound event of
`S-RELEASE indication`, the event fired would be `SRELind`, which takes a
`FINISH SPDU` as its second argument.

In addition to the above, each layer file has functions for encoding and
decoding PDUs for that given layer and some utility functions. Most importantly,
each file has a function for producing a brand-new protocol machine state for
that layer. This usually MUST be called to set up the protocol machine state,
since some of the protocol machines subscribe to their own outbound events.
(This may be subject to change in the future, since it muddles the separation
between layers.)

Finally, some (N)-PDUs map many-to-one to (N-1)-PDUs. For this reason, we have
to individually parse (N)-PDUs out of an (N-1)-PDU. For protocols for which this
is the case, there are functions that take a complete (N-1)-PDU, parse the
(N)-PDUs out of it, decode them, and dispatch them to the protocol machine
state.

#### Example

Let's say you were implementing the OSI "monkey layer" (a fictitious protocol
made for this example, to be clear). This protocol machine has one inbound
event, `M-BANANA response`, and one outbound event, `M-BANANA confirm`.

To recap, an individual layer, at a high level, would look like this:

```typescript

export
interface N_Minus_1_Layer {
  sendPDU (bytes: Buffer);
}

export
interface MonkeyState {
  happy: boolean;
  n_minus_1_layer: N_Minus_1_Layer;
}

export function newMonkey (n_minus_1_layer: N_Minus_1_Layer): MonkeyState {
  return {
    outboundEvents: new EventEmitter(),
    n_minus_1_layer,
    happy: false,
  };
}

export function dispatch_M_BANresp (state: MonkeyState): void {
  switch (state.happy) {
    case (true): {
      console.error("Monkey is already happy. There is no need for banana.");
      process.exit(1);
    }
    case (false): {
      state.happy = true;
      state.outboundEvents.emit("M-BANcnf");
      return;
    }
  }
}

export function parseMPDU (state: MonkeyState, bytes: Buffer) {
  if (bytes[0] === 1) {
    dispatch_M_BANresp(state);
  } else {
    console.error("Unrecognized M-PDU. Terminating.");
    process.exit(1);
  }
}
```

Then, to implement the protocol that uses the services of the "monkey-layer,"
you would listen for the `M-BANcnf` to know when the monkey got the banana.

```typescript
const m = newMonkey(lowerLayer);
m.outboundEvents.on("M-BANcnf", () => {
  console.log("Banana received. Monkey is now happy.");
});
```

### Stacks

By themselves the individual protocol machines don't do much of anything. They
have to be wired together to produce a protocol stack. This separation of
concerns is intentional, so that they can be layered on top over different
networking protocols, primarily, or even different implementations of individual
layers (meaning that there could be, say, two different X.224 transport layer
implementations, as long as they use the same API). The file `itot.ts` in this
library is one such "wiring up" whereby ISO Transport Over TCP is provided.

## Note

One of the shortcomings of this library is that it does not currently support
multiple (N)-entities per (N-1)-entity. Every single connection has only one
network, transport, session and presentation entity.

I think this could be implemented by refactoring individual entities into
"layer" objects, which do nothing more than provide mapping between (N)-SAP
addresses and the entities themselves, to which "incoming events" would be
dispatched as they are now.

### Segmenting of SSDUs in the ITU Rec. X.225 Annex A State Tables

I had to hunt forever to find some clarification on what to do here.

ITU Recommendation X.225 (1995), Annex A, Section A.4.2.3:

> The state tables do not take account of segmented SSDUs. When an outgoing SSDU
> is to be segmented or an incoming SSDU is segmented, the procedures defined in
> 7.37 apply to the outgoing event at the appropriate intersection of the state
> tables (that part of the action which transmits the SPDU).

Also worthy of mention, ITU Recommendation X.225 (1995), Section 7.37.1, states
that:

> Where an SSDU is segmented, the first SPDU contains all the parameters which
> would have been present in the SPDU if the SSDU had not been segmented...

This means that this implementation needs to:

1. Record the parameters of the first SPDU that starts a new SSDU.
2. Avoid changing state other than buffering user data until the complete SSDU
   arrives.

I think implementing (1) above could be done (albeit in an ugly fashion) by
having per-SPDU type fields on the SPM state (e.g. `cn`, `fn`, `ab`, etc.). The
properties of this saved SPDU would simply be spread into the final assembled
SPDU. This really only seems necessary for `REFUSE` and `ACCEPT`. The other
SPDUs have not-super-important non-user-data parameters where it would likely
be okay if those were not persisted between SPDUs.

For implementing (2) above, before dispatching the SPDUs, you could check for
the Enclosure Item parameter and defer dispatching if it indicates that there
are more segments of the complete SSDU to follow. This would cleanly avoid state
change, and it would not require too much code. The downside is that it would
require buffering the entire SSDU before returning an error, if there is one.

## Deviations

One big deviations from the specification in this implementation is that some
"invalid intersections" (combination of a current state and an incoming event)
do not lend themselves to following the specified instructions for invalid
intersections.

For instance, in the ACSE, if a `P-CONcnf-` (presentation-layer connect reject)
is received, it makes no sense to send an ACSE abort, because you don't have a
presentation layer over which to do that! So, necessarily, we must deviate from
the specification for handling certain "invalid intersections."

## To Do

- [ ] Return (N)-SAP selectors at each layer.
- [ ] Support many-to-one (N)-entities-to-(N-1)-entities mapping.
