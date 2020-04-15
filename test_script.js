var test_name_list = [];
var input_text_list = [];
var input_radio_list = [];
var output_text_list = [];

// the names of the various data types in the form
var input_text_names = ["longi", "lati", "elev", "stime", "year", "month", "day", "temp", "humid", "snel", "accuity", "age", "alt", "az"];
var input_radio_names = ["longdir", "latdir", "dst"];
var output_text_names = ["alt_sun", "az_sun", "rhosn", "magsn", "alt_moon", "az_moon", "rhomn", "ill_frac", "magmn", "limmag", "magerr", "K", "D", "Bnl", "Bmnl", "Bmag", "Bmmag", "jd", "lst"];

// test vectors

test_name_list.push("test 1");
input_text_list.push(["97 24", "30 25", "274", "11:22:33", "2000", "12", "25", "50", "51", "1.0", "6", "25", "44", "179"]);
input_radio_list.push([0, 0, 0]);
output_text_list.push(["28.1", "146.7", "30.3", "-26.16", "28.5", "146.6", "30.1", "0", "-3.19", "-4.35", "0.36", "0.28", "0.4", "1.52E9", "1", "3.37", "26.34", "2451904.182326389", "16h10m54s"]);

test_name_list.push("test 2");
input_text_list.push(["97 24", "30 25", "274", "11:22:33", "2000", "12", "25", "50", "51", "1.0", "6", "25", "44", "179"]);
input_radio_list.push([1, 1, 1]);
output_text_list.push(["82.7", "14.7", "53", "-26.46", "80.6", "335.9", "54.7", "0.26", "-4.18", "-4.05", "0.36", "0.27", "0.4", "1.15E9", "1.35", "3.68", "26", "2451903.7239930555", "18h8m18s"]);


function run_test(mode) {
    var output;
    var npass = 0;
    var nfail = 0;
    var warnings = [];

    // set up the function output
    switch (mode) {
        case "test":
            output = "<table border=1>";
            break;
        case "generate":
            output = "<pre>\n";
            break;
        default:
            alert("unknown test mode: " + mode);
            return "";
    }

    // run the test vectors
    for (var i = 0; i < test_name_list.length; i++) {

        // sanity check the number of input elements
        if (input_text_names.length != input_text_list[i].length)
            warnings.push("input_text_list length mismatch for " + test_name_list[i])
        if (input_radio_names.length != input_radio_list[i].length)
            warnings.push("input_radio_list length mismatch for " + test_name_list[i])

        // load the inputs into the form
        for (var j = 0; j < input_text_names.length; j++)
            document.form[input_text_names[j]].value = input_text_list[i][j];
        for (var j = 0; j < input_radio_names.length; j++)
            document.form[input_radio_names[j]][input_radio_list[i][j]].checked = true;

        // calculate the output
        calculate();

        // act according to the test mode
        if (mode == "test") {

            // check the output
            var fail_table = "";
            for (var j = 0; j < output_text_names.length; j++) {
                if (document.form[output_text_names[j]].value != output_text_list[i][j]) {
                    if (fail_table == "")
                        fail_table = "<table cellpadding=3><tr><th>FAIL</th><td>expected</td><td>observed</td></tr>";
                    fail_table += "<tr>";
                    fail_table += "<td>" + output_text_names[j] + "</td>";
                    fail_table += "<td>" + output_text_list[i][j] + "</td>";
                    fail_table += "<td>" + document.form[output_text_names[j]].value + "</td>";
                    fail_table += "</tr>";
                }
            }

            // generate the report
            output += '<tr><td valign="top">' + test_name_list[i] + "</td><td>";
            if (fail_table == "") {
                output += "pass";
                npass += 1;
            } else {
                output += fail_table + "</table>";
                nfail += 1;
            }
            output += "</td></tr>";
        }
        else if (mode == "generate") {

            // repeat the input vectors and generate the output vectors
            if (i == 0) {
                // on the first pass print the name lists

                output += "input_text_names = [";
                for (var j = 0; j < input_text_names.length; j++) {
                    if (j) output += ", ";
                    output += '"' + input_text_names[j] + '"';
                 }
                output += "];\n";

                output += "input_radio_names = [";
                for (var j = 0; j < input_radio_names.length; j++) {
                    if (j) output += ", ";
                    output += '"' + input_radio_names[j] + '"';
                 }
                output += "];\n";

                output += "output_text_names = [";
                for (var j = 0; j < output_text_names.length; j++) {
                    if (j) output += ", ";
                    output += '"' + output_text_names[j] + '"';
                 }
                output += "];\n\n";
            }

            output += 'test_name_list.push("' + test_name_list[i] + '");\n';

            output += "input_text_list.push([";
            for (var j = 0; j < input_text_list[i].length; j++) {
                if (j) output += ", ";
                output += '"' + input_text_list[i][j] + '"';
            }
            output += "]);\n";

            output += "input_radio_list.push([";
            for (var j = 0; j < input_radio_list[i].length; j++) {
                if (j) output += ", ";
                output += input_radio_list[i][j];
            }
            output += "]);\n";

            output += "output_text_list.push([";
            for (var j = 0; j < output_text_names.length; j++) {
                if (j) output += ", ";
                output += '"' + document.form[output_text_names[j]].value + '"';
            }
            output += "]);\n\n";
        }
    }

    // finalize the output
    switch (mode) {
        case "test":
            output = "<p>pass: " + npass + "<br>fail: " + nfail + "</p>" + output + "</table>";
            break;
        case "generate":
            output += "\n</pre>";
            break;
    }

    // display any warnings
    if (warnings.length) {
        output += "<h3>Warnings:</h3><ul>";
        for (var j = 0; j < warnings.length; j++) {
            output += "<li>" + warnings[j] + "</li>";
        }
        output += "</ul>";
    }

    return output;
}
