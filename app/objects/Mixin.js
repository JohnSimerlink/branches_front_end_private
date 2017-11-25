"use strict";
exports.__esModule = true;
function Mixin() {
    var classes = []; /*: Function[]*/
    for (var _i = 0 /*: Function[]*/; _i < arguments.length /*: Function[]*/; _i++ /*: Function[]*/) {
        classes[_i] = arguments[_i]; /*: Function[]*/
    }
    return function (combinedConstructor) {
        classes.forEach(function (constructor) {
            Object.getOwnPropertyNames(constructor.prototype).forEach(function (name) {
                var descriptor = Object.getOwnPropertyDescriptor(constructor.prototype, name);
                if (name === 'constructor') {
                    return;
                }
                if (descriptor &&
                    (!descriptor.writable || !descriptor.configurable || !descriptor.enumerable
                        || descriptor.get || descriptor.set)) {
                    Object.defineProperty(combinedConstructor.prototype, name, descriptor);
                }
                else {
                    combinedConstructor.prototype[name] = constructor.prototype[name];
                }
            });
        });
    };
}
exports.Mixin = Mixin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWl4aW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJNaXhpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBO0lBQWUsaUJBQVUsQ0FBQSxnQkFBZ0I7U0FBMUIsVUFBVSxDQUFBLGdCQUFnQixFQUExQixxQkFBVSxDQUFBLGdCQUFnQixFQUExQixJQUFVLENBQUEsZ0JBQWdCO1FBQTFCLDRCQUFVLENBQUEsZ0JBQWdCOztJQUNyQyxNQUFNLENBQUMsVUFBQyxtQkFBdUM7UUFDM0MsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFBLFdBQVc7WUFDdkIsTUFBTSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJO2dCQUMxRCxJQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsd0JBQXdCLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFFaEYsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLGFBQWEsQ0FBQyxDQUFDLENBQUM7b0JBQ3pCLE1BQU0sQ0FBQztnQkFDWCxDQUFDO2dCQUVELEVBQUUsQ0FBQyxDQUFDLFVBQVU7b0JBQ1YsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxRQUFRLElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVU7MkJBQ3BFLFVBQVUsQ0FBQyxHQUFHLElBQUksVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDM0MsTUFBTSxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUMzRSxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN0RSxDQUFDO1lBRUwsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQztBQUNOLENBQUM7QUFFTyxzQkFBSyJ9