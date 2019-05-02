/* global require, describe, it, before, afterEach, setTimeout, document, window, console, navigator, Event */

'use strict';

var embedHtml = require('../../lib/dom/embedHtml.js');
var expect = require('expect.js');

/**
 * Returns true if the user agent string matches a list of mobile identifiers
 *
 * @returns {boolean}
 */
var isMobile = function () {
	var check = false;
	(function (a) {
		if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
			check = true;
		}
	})(navigator.userAgent || navigator.vendor || window.opera);
	return check;
};

describe('embedHtml', function () {
	this.timeout(10000);
	
	it('should be able to add three elements in series', function (done) {
		var custom0 = '<div id="custom0"></div>';
		embedHtml(custom0);
		expect(document.getElementById('custom0')).to.not.equal(null);
		done();
	});
	
	it('should add multiple custom elements', function (done) {
		var custom1 = '<div id="custom1">custom1</div>',
			custom2 = '<div id="custom2">custom2</div>',
			custom3 = '<div id="custom3">custom3</div>';
		
		embedHtml(custom1);
		embedHtml(custom2);
		embedHtml(custom3);
		
		expect(document.getElementById('custom1')).to.not.equal(null);
		expect(document.getElementById('custom2')).to.not.equal(null);
		expect(document.getElementById('custom3')).to.not.equal(null);
		
		done();
	});
	
	it('should be able to add an inline script to the page dynamically after the page has loaded', function (done) {
		var htmlString = '<script>window.testVar1 = true;</script>';
		embedHtml(htmlString);
		expect(window.testVar1).to.be(true);
		delete window.testVar1;
		done();
	});
	
	it('should be able to add an inline script with an id and a data attribute to the page dynamically after the page has loaded', function (done) {
		var htmlString = '<script id="test-script1" data-foo="bar">window.testVar2 = true;</script>';
		embedHtml(htmlString);
		expect(window.testVar2).to.be(true);
		delete window.testVar2;
		expect(document.querySelector('#test-script1')).to.not.equal(null);
		expect(document.querySelector('#test-script1').getAttribute('data-foo')).to.equal('bar');
		done();
	});
	
	it('should be able to add a div and an inline script to the page dynamically after the page has loaded', function (done) {
		var htmlString = '<div>Hello World</div><script>window.testVar3 = true;</script><div>Goodbye World</div>';
		embedHtml(htmlString);
		expect(window.testVar3).to.be(true);
		delete window.testVar3;
		done();
	});
	
	it('should be able to add an ins and a nested inline script to the page dynamically after the page has loaded', function (done) {
		var htmlString = '<ins><script>window.testVar4 = true;</script></ins>';
		embedHtml(htmlString);
		expect(window.testVar4).to.be(true);
		delete window.testVar4;
		done();
	});
	
	
	it('should be able to add a deeply nested inline script to the page dynamically after the page has loaded (and execute it)', function (done) {
		var htmlString = '<ins><div><span><script>window.testVar5 = true;</script></span></div></ins>';
		embedHtml(htmlString);
		expect(window.testVar5).to.be(true);
		delete window.testVar5;
		done();
	});
	
	it('should add the custom elements after MRAID fires ready', function (done) {
		var readyEvent = new Event('ready'),
			mraidTime = 2000,
			executeHtmlStringTime = mraidTime + 1000,
			custom1;
		
		if (!isMobile()) {
			done();
		}
		
		// set up mock mraid
		window.mraid = document.createElement('div');
		window.mraid.getState = function () {
			return 'loading';
		};
		setTimeout(function () {
			window.mraid.dispatchEvent(readyEvent);
		}, 2000);
		
		custom1 = '<div id="custom1"></div>';
		embedHtml(custom1);
		
		setTimeout(function () {
			expect(document.getElementById('custom1')).to.not.equal(null);
			done();
		}, executeHtmlStringTime);
		
	});
	
	it('should add the custom elements immediately because MRAID is ready', function (done) {
		var htmlString = '<div id="htmlString"></div>';
		
		if (!isMobile()) {
			done();
		}
		// set up mock mraid
		window.mraid = document.createElement('div');
		window.mraid.getState = function () {
			return 'default';
		};
		
		embedHtml(htmlString);
		
		expect(document.getElementById('htmlString')).to.not.equal(null);
		done();
		
	});
	
	it('should be able to handle a nested script that document.writes a span after the page has loaded', function (done) {
		var writeSpan,
			htmlString = '<ins><div><span><script>document.write("<span id=\'write-span\'></span>");</script></span></div></ins>';
		
		embedHtml(htmlString);
		writeSpan = document.querySelector('#write-span');
		expect(writeSpan).to.not.be(undefined);
		done();
	});
	
	it('should be able to handle a script that document.writes another inline script after the page has loaded', function (done) {
		var writeScript,
			htmlString = '<script>document.write("<scri" + "pt id=\'write-script\'>window.scriptWritten = true;</scr" + "ipt>");</script>';
		
		embedHtml(htmlString);
		
		writeScript = document.querySelector('#write-script');
		expect(writeScript).to.not.be(undefined);
		expect(window.scriptWritten).to.be(true);
		delete window.scriptWritten;
		done();
	});
	
	it('should be able to add an external script to the page dynamically after the page has loaded (and execute it)', function (done) {
		var htmlString = '<script src="/base/public/set-global-var.js"></script>';
		embedHtml(htmlString);
		
		setTimeout(function () {
			expect(window.embedHtml).to.be(true);
			delete window.embedHtml; //jshint ignore: line
			done();
		}, 300);
	});
	
	it('should be able to add a deeply nested external script to the page dynamically after the page has loaded (and execute it)', function (done) {
		var htmlString = '<ins><div><span><script src="/base/public/set-global-var.js"></script></span></div></ins>';
		embedHtml(htmlString);
		
		setTimeout(function () {
			expect(window.embedHtml).to.be(true);
			delete window.embedHtml; //jshint ignore: line
			done();
		}, 300);
	});
	
	it('should be able to handle a deeply-nested script that document.writes another external script after the page has loaded', function (done) {
		var writeScript,
			htmlString = '<div><span><script>document.write("<scri" + "pt id=\'write-script\' src=\'/base/public/set-global-var.js\'></scr" + "ipt>");</script></span></div>';
		embedHtml(htmlString);
		
		setTimeout(function () {
			writeScript = document.querySelector('#write-script');
			expect(writeScript).to.not.be(undefined);
			expect(window.embedHtml).to.be(true);
			delete window.embedHtml; //jshint ignore: line
			done();
		}, 300);
	});
	
	it('Should append an HTML string to the default parent element', function() {
		embedHtml('<div class="foo">bar</div><span class="baz">something</span>');
		expect(document.querySelectorAll('.foo').length).to.equal(1);
		expect(document.querySelectorAll('.baz').length).to.equal(1);
	});
	
	it('Should append scripts in an HTML string so that they still load remote JavaScript', function(done) {
		embedHtml('<script id="test-script" src="/base/public/append-html-verify.js" data-foo="bar"></script>');
		
		// Verify both the loaded JavaScript, and the existence of the attribute, since we want to make sure the script tag was properly cloned.
		setTimeout(function() {
			var script = document.querySelector('#test-script');
			expect(script.getAttribute('data-foo')).to.be('bar');
			expect(window.APPEND_HTML_TEST).to.equal(true);
			done();
		}, 300);
	});
	
	//This test has to be run independently because it performs document open/write/close
	xit('should be able to handle a deeply-nested script that document.writes another external script during page load', function (done) {
		var writeScript,
			htmlString = '<div><span><script>document.write("<scri" + "pt id=\'write-script\' src=\'/base/public/set-global-var.js\'></scr" + "ipt>");</script></span></div>';
		document.open('text/html', 'replace');
		embedHtml(htmlString);
		document.close();
		
		setTimeout(function () {
			writeScript = document.querySelector('#write-script');
			expect(writeScript).to.not.be(undefined);
			expect(window.embedHtml).to.be(true);
			delete window.embedHtml; //jshint ignore: line
			done();
		}, 300);
	});
    
    it('should be able to add a script to the page dynamically while the page is open (and execute it) using reference to the window', function (done) {
        var nestedIframe = document.createElement('iframe');
        nestedIframe.id = 'nestedIframe';
        document.body.appendChild(nestedIframe);
        
        var iframeWindow = nestedIframe.contentWindow;
        iframeWindow.document.open();
        var htmlString = '<div></div><script>window.testVar6 = true;</script></div>';
        
        embedHtml(htmlString, undefined, function() {
            expect(iframeWindow.testVar6).to.be(true);
            expect(iframeWindow.document.getElementsByTagName('ins').length).to.be(0);
            
            expect(window.testVar6).to.be(undefined);
            
            done();
        }, iframeWindow);
        delete window.nestedIframe;
    });
    
    it('should be able to add a script to the page dynamically after the page has loaded (and execute it) using reference to the window', function (done) {
        var nestedIframe = document.createElement('iframe');
        nestedIframe.id = 'nestedIframe';
        document.body.appendChild(nestedIframe);
    
        var iframeWindow = nestedIframe.contentWindow;
        var htmlString = '<div></div><script>window.testVar7 = true;</script></div>';
        
        embedHtml(htmlString, undefined, function () {
            expect(window.testVar7).to.be(undefined);
    
            if (iframeWindow.document.readyState === 'complete' || iframeWindow.document.readyState === 'interactive') {
                expect(iframeWindow.document.getElementsByTagName('ins').length).to.be.greaterThan(0);
            } else {
                expect(iframeWindow.document.getElementsByTagName('ins').length).to.be(0);
			}
        
            expect(iframeWindow.testVar7).to.be(true);
        
            done();
        }, iframeWindow);
        delete window.nestedIframe;
    });
    it('should be able to add new lines when using doc.writeln', function (done) {
        var htmlString = '<script id="testWriteln1">document.writeln("<pre>hello"); document.writeln("bye</pre>")</script>';
        embedHtml(htmlString);
        expect(document.body.innerText).to.contain('hello\nbye');
        delete window.testWriteln1;
        done();
    });
    it('should not add new lines when using doc.write', function (done) {
    	var htmlString = '<script id="testWriteln2">document.write("helloAgain");document.write("byeAgain")</script>';
        embedHtml(htmlString);
        expect(document.body.innerText).to.contain('helloAgainbyeAgain');
        delete window.testWriteln2;
        done();
    });
    
    it('should be able to add new lines when using doc.writeln with window reference', function (done) {
        var nestedIframe = document.createElement('iframe');
        nestedIframe.id = 'nestedIframe';
        document.body.appendChild(nestedIframe);
    
        var iframeWindow = nestedIframe.contentWindow;
        iframeWindow.open();
        var htmlString = '<script id="testWriteln3">document.writeln("<pre>helloReference");document.writeln("byeReference</pre>")</script>';
        embedHtml(htmlString, undefined, function () {
            if (iframeWindow.document.readyState === 'complete' || iframeWindow.document.readyState === 'interactive') {
                expect(document.body.innerText).to.contain('helloReference\nbyeReference');
            } else {
                expect(iframeWindow.document.body.innerText).to.contain('helloReference\nbyeReference');
            }
        
            delete window.nestedIframe;
            done();
        }, iframeWindow);
    });
    it('should not add new lines when using doc.write with window reference', function (done) {
        var nestedIframe = document.createElement('iframe');
        nestedIframe.id = 'nestedIframe';
        document.body.appendChild(nestedIframe);
    
        var iframeWindow = nestedIframe.contentWindow;
        iframeWindow.open();
        var htmlString = '<script id="testWriteln4">document.write("helloAgainReference");document.write("byeAgainReference")</script>';
        embedHtml(htmlString, undefined, function () {
            if (iframeWindow.document.readyState === 'complete' || iframeWindow.document.readyState === 'interactive') {
                expect(document.body.innerText).to.contain('helloAgainReferencebyeAgainReference');
            } else {
                expect(iframeWindow.document.body.innerText).to.contain('helloAgainReferencebyeAgainReference');
            }
            
            delete window.nestedIframe;
            done();
        }, iframeWindow);
    });
    
});
