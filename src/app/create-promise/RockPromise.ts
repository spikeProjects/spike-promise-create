
class RockPromise {

	private promiseStatus;
	private promiseValue;

    constructor(executor) {
        this.promiseStatus = RockPromise.PENDING;
        this.promiseValue;
        this.execute(executor);
    }

    execute(executor) {
        if (typeof executor != 'function') {
            throw new Error(` RockPromise resolver ${executor} is not a function`);
        }
        //捕获错误
        try {
            executor(data => {
                this.promiseStatus = RockPromise.FULFILLED;
                this.promiseValue = data;
            }, data => {
                this.promiseStatus = RockPromise.REJECTED;
                this.promiseValue = data; 
            });
        } catch (e) {
            this.promiseStatus = RockPromise.REJECTED;
            this.promiseValue = e;
        }
    }

    then(onfulfilled, onrejected) {
	    let _ref = null,
	        timer = null,
	        result = new RockPromise(() => {});

	    //因为 promise 的 executor 是异步操作,需要监听 promise 对象状态变化，并且不能阻塞线程
	    timer = setInterval(() => {

	        if ((typeof onfulfilled == 'function' && this.promiseStatus == RockPromise.FULFILLED) ||
	            (typeof onrejected == 'function' && this.promiseStatus == RockPromise.REJECTED)) {
	            //状态发生变化，取消监听
	            clearInterval(timer);
	            //捕获传入 then 中的回调的错误，交给 then 返回的 promise 处理
	            try {
	                if (this.promiseStatus == RockPromise.FULFILLED) {
	                    _ref = onfulfilled(this.promiseValue);
	                } else {
	                    _ref = onrejected(this.promiseValue);
	                }

	                //根据回调的返回值来决定 then 返回的 RockPromise 实例的状态
	                if (_ref instanceof RockPromise) {
	                    //如果回调函数中返回的是 RockPromise 实例，那么需要监听其状态变化，返回新实例的状态是根据其变化相应的
	                    timer = setInterval(()=>{
	                        if (_ref.promiseStatus == RockPromise.FULFILLED ||
	                            _ref.promiseStatus == RockPromise.REJECTED) {
	                            clearInterval(timer);
	                            result.promiseValue = _ref.promiseValue;
	                            result.promiseStatus = _ref.promiseStatus;
	                        }
	                    },0);

	                } else {
	                    //如果返回的是非 RockPromise 实例
	                    result.promiseValue = _ref;
	                    result.promiseStatus = RockPromise.FULFILLED;
	                }
	            } catch (e) {
	                //回调中抛出错误的情况
	                result.promiseStatus = RockPromise.REJECTED;
	                result.promiseValue = e;
	            }
	        }

	    }, 0);

	    //promise 之所以能够链式操作，因为返回了RockPromise对象
	    return result;
	    
	}
}

RockPromise.PENDING = 'pedding';
RockPromise.FULFILLED = 'resolved';
RockPromise.REJECTED = 'rejected';