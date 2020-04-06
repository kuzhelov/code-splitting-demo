import { featureA, featureB } from './setA'
import { featureC } from './setB'

class MainService {
    constructor(
        private readonly a: featureA,
        private readonly b: featureB,
        private readonly c: featureC,
    ) {
    }

    simpleProcess() {
        this.c.process();
    }

    process() {
        this.a.process();
        this.b.process();
        this.c.process();
    }
}

const service = new MainService(
    new featureA(), 
    new featureB(), 
    new featureC())

service.process()