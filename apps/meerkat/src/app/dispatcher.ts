// A skeletal implementation of the Operation Dispatcher defined in ITU X.518.

export
class ModificationEvaluationProceduresComponent {

}

export
class SingleObjectEvaluationProceduresComponent {

}

export
class List1ProcedureComponent {

}

export
class List2ProcedureComponent {

}

export
class SearchRuleCheckProcedure1Component {

}

export
class SearchRuleCheckProcedure2Component {

}

export
class Search1ProcedureComponent {

}

export
class Search2ProcedureComponent {

}

export
class ListContinuationReferenceProcedureComponent {

}

export
class SearchContinuationReferenceProcedureComponent {

}

export
class RelatedEntryProcedureComponent {

}

// Subcomponents of Name resolution

export
class FindDSEProcedureComponent {

}

export
class NameResolutionContinuationReferenceProcedureComponent {

}

// Subcomponents of OperationDispatcher

export
class RequestValidationProcedureComponent {

}

export
class NameResolutionComponent {
    constructor (
        readonly findDSEProcedure: FindDSEProcedureComponent,
        readonly nameResolutionContinuationReferenceProcedure: NameResolutionContinuationReferenceProcedureComponent,
    ) {}
}

export
class AbandonProcedureComponent {

}

export
class ResultsMergingProcedure {

}

export
class EvaluationComponent {
    constructor (
        readonly modificationEvaluationProcedures: ModificationEvaluationProceduresComponent,
        readonly singleObjectEvaluationProcedures: SingleObjectEvaluationProceduresComponent,
        readonly list1Procedure: List1ProcedureComponent,
        readonly list2Procedure: List2ProcedureComponent,
        readonly searchRuleCheckProcedure1: SearchRuleCheckProcedure1Component,
        readonly searchRuleCheckProcedure2: SearchRuleCheckProcedure2Component,
        readonly search1Procedure: Search1ProcedureComponent,
        readonly search2Procedure: Search2ProcedureComponent,
        readonly listContinuationReferenceProcedure: ListContinuationReferenceProcedureComponent,
        readonly searchContinuationReferenceProcedure: SearchContinuationReferenceProcedureComponent,
        readonly relatedEntryProcedure: RelatedEntryProcedureComponent,
    ) {}
}

export
class OperationDispatcher {
    constructor (
        readonly requestValidationProcedure: RequestValidationProcedureComponent,
        readonly nameResolution: NameResolutionComponent,
        readonly abandonProcedure: AbandonProcedureComponent,
        readonly resultsMergingProcedure: ResultsMergingProcedure,
        readonly evaluation: EvaluationComponent,
    ) {}
}
