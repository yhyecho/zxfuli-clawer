var obj = {
	step1: function(){
		console.log('aaa');
		return this;
	},
	step2: function(){
		console.log('bbb');
		return this;
	},
	step3: function(){
		console.log('ccc');
		return this;
	},
	step4: function(){
		console.log('ddd');
		return this;
	}
}

console.log('----------------\n');
obj.step1().step2().step3()
console.log('----------------\n');
obj.step3().step2().step1();