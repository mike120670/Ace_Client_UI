// var items = ['One', 'Two', 'Three'];
// var stuff = items.map(f => toObject(f));
function toObject(val, index) {
	return { 'name': val, 'value': val };
}

function mapToNamesWithValues(data) {
    return data.map(f => { return { 'Name': f, 'Value': f } });
}

function createSequence(start, end) {
    var sequence = [];

    for (var k = start; start <= end; k++) {
        sequence.push(k);
    }

    return sequence;
}