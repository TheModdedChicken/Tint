exports.generateRPC = function (details = true, state = true) {
    var result = undefined;

    if (details) {
        result += 'D';
    }
    
    if (state) {
        result += 'S';
    }
}