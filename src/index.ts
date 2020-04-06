
// NOTE: features are imported dynamically
//
// import { featureA, featureB } from './setA'
// import { featureC } from './setB'

// UTILITY TYPE and METHOD
type AsyncGetter<T> = () => Promise<T> 
const once = <T>(getResult: AsyncGetter<T>): AsyncGetter<T> => {
    let resultPromise = undefined

    return () => {
        if (!resultPromise) {
            resultPromise = getResult()
        }

        return resultPromise
    }
}

export const importFeatureSetA = once(async () => {
    const { featureA: A, featureB: B } = await import(/* webpackChunkName: "featureSetA" */ './setA');

    return { 
        a: new A(), 
        b: new B() 
    }
})

export const importFeatureSetB = once(async () => {
    const { featureC: C } = await import(/* webpackChunkName: "featureSetB" */ './setB');

    return {
        c: new C()
    }
})

class MainService {
    constructor(
        private readonly featureSetA: () => ReturnType<typeof importFeatureSetA>,
        private readonly featureSetB: () => ReturnType<typeof importFeatureSetB>
    ) {
    }

    async simpleProcess() {
        const { c } = await this.featureSetB()
        c.process();
    }

    async process() {
        const { a, b } = await this.featureSetA()
        const { c } = await this.featureSetB()

        a.process();
        b.process();
        c.process();
    }
}

const service = new MainService(
   importFeatureSetA,
   importFeatureSetB)

service.simpleProcess() // should only load featureSetB !!

// NOTE: the following line could be commented out, to check the effect of feature's dynamic loading
service.process()  // should load both featureSetA and featureSetB !!