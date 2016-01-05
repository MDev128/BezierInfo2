var sha1 = require("sha1");
var fs = require("fs");
var execSync = require("child_process").execSync;
var blockLoader = require("block-loader");

var options = {
  start: "\\[",
  end: "\\]",

  preprocessors: [
    /**
     * convert some convenience colour markers to true LaTeX form.
     */
    function colorPreProcess(input) {
      var regexp = new RegExp("([A-Z]+)\\[([^\\]]+)\\]",'g');
      var output = input.replace(regexp, function(_,color,content) {
        if(content.indexOf(" ")!==-1) { content = " " + content; }
        return "{\\color{"+color.toLowerCase()+"}"+content.replace(/ /g,"\\ ")+"}";
      });
      return output;
    }
  ],

  /**
   * We look for MathJax/KaTeX style data, and make sure
   * it is escaped properly so that JSX conversion will
   * still work.
   */
  process: function escapeBlockLaTeX(latex) {
    // convert this LaTeX code into an SVG file in ./images/latex,
    // using mathjax-node in the ./tools directory.
    var hash = sha1(latex);
    var filename = "images/latex/" + hash + ".svg";
    var destination = __dirname + "/../" + filename;

    // And only generate if the file doesn't already exist, of course.
    if (!fs.existsSync(destination)) {
      var cmdarg = new Buffer(latex).toString("base64");
      var cmd = "npm run latex -- --hash " + hash + " --base64 " + cmdarg;
      console.log(" generating " + hash + ".svg");
      execSync(cmd);
    }

    // Make sure we hardcode the size of this LaTeX SVG image, because we absolutely
    // do not want the page to resize in any possible noticable way if we can help it.
    // The SVG contains values in "ex" units, but to maximise legibility we convert
    // these to "rem" instead, so that formulae are always sized the same, no matter
    // the textsize around them.
    var svg = fs.readFileSync(filename).toString();
    var ex2rem = 0.45;
    var w = parseFloat(svg.match(/width="([^"]+)"/)[1]) * ex2rem;
    var h = parseFloat(svg.match(/height="([^"]+)"/)[1]) * ex2rem;
    return `<img className="LaTeX SVG" src="${filename}" style={{width:"${w}rem", height:"${h}rem"}} />`;
  }
};

module.exports = blockLoader(options);

