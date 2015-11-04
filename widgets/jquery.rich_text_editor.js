(function ($) {

var oDoc, sDefTxt;

var counter = 0;

WIDGET_LIST = {};



//  ***********************************************************
//  *         rich_text_editor widget
//  ***********************************************************

// Source: https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla
// execCommands: https://developer.mozilla.org/en-US/docs/Web/API/document.execCommand
    $.widget('systo.rich_text_editor', {
        meta:{
            short_description: 'This is the toolbar widget for a rich text editor.',
            long_description: '<p>This widget is not Systo-specific.  It simply handles the toolbar'+
                'for a rich text editor which can be used in any application.</p>'+
                'It is closely based on the stand-alone example given at '+
                'https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla'+
                'with grateful acknowledgement.',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            options: {
            }
        },

        options: {
        },

        widgetEventPrefix: 'rich_text_editor:',

        _create: function () {
            var self = this;
            this.element.addClass('rich_text_editor-1');

            var div = $('<div></div>');

            var rte_compForm = $('<form name="compForm" style="border:solid 1px #808080; background-color:white; width:630px;"></form>');
            $(div).append(rte_compForm);

            var rte_myDoc = $('<input type="hidden" name="myDoc">');
            $(rte_compForm).append(rte_myDoc);

            var rte_toolbar1 = $('<div id="toolBar1"></div>');
            $(rte_compForm).append(rte_toolbar1);

            var rte_formatblock = $(
                '<select>'+
                    '<option selected>- formatting -</option>'+
                    '<option value="h1">Title 1 &lt;h1&gt;</option>'+
                    '<option value="h2">Title 2 &lt;h2&gt;</option>'+
                    '<option value="h3">Title 3 &lt;h3&gt;</option>'+
                    '<option value="h4">Title 4 &lt;h4&gt;</option>'+
                    '<option value="h5">Title 5 &lt;h5&gt;</option>'+
                    '<option value="h6">Subtitle &lt;h6&gt;</option>'+
                    '<option value="p">Paragraph &lt;p&gt;</option>'+
                    '<option value="pre">Preformatted &lt;pre&gt;</option>'+
                '</select>').
                change(function() {
                    formatDoc('formatblock',this[this.selectedIndex].value);
                    this.selectedIndex = 0;
                });
            $(rte_toolbar1).append(rte_formatblock);

            var rte_fontname = $(
                '<select>'+
                '<option class="heading" selected>- font -</option>'+
                '<option>Arial</option>'+
                '<option>Arial Black</option>'+
                '<option>Courier New</option>'+
                '<option>Times New Roman</option>'+
                '</select>').
                change(function() {
                    formatDoc('fontname',this[this.selectedIndex].value);
                    this.selectedIndex = 0;
                });
            $(rte_toolbar1).append(rte_fontname);

            var rte_fontsize = $(
                '<select>'+
                '<option class="heading" selected>- size -</option>'+
                '<option value="1">Very small</option>'+
                '<option value="2">A bit small</option>'+
                '<option value="3">Normal</option>'+
                '<option value="4">Medium-large</option>'+
                '<option value="5">Big</option>'+
                '<option value="6">Very big</option>'+
                '<option value="7">Maximum</option>'+
                '</select>').
                change(function() {
                    formatDoc('fontsize',this[this.selectedIndex].value);
                    this.selectedIndex = 0;
                });
            $(rte_toolbar1).append(rte_fontsize);

            var rte_forecolor = $(
                '<select>'+
                '<option class="heading" selected>- color -</option>'+
                '<option value="red">Red</option>'+
                '<option value="blue">Blue</option>'+
                '<option value="green">Green</option>'+
                '<option value="black">Black</option>'+
                '</select>').
                change(function() {
                    formatDoc('forecolor',this[this.selectedIndex].value);
                    this.selectedIndex = 0;
                });
            $(rte_toolbar1).append(rte_forecolor);

            var rte_backcolor = $(
                '<select>'+
                '<option class="heading" selected>- background -</option>'+
                '<option value="red">Red</option>'+
                '<option value="green">Green</option>'+
                '<option value="black">Black</option>'+
                '</select>').
                change(function() {
                    formatDoc('backcolor',this[this.selectedIndex].value);
                    this.selectedIndex = 0;
                });
            $(rte_toolbar1).append(rte_backcolor);

            var rte_toolbar2 = $('<div id="toolBar2"></div>');
            $(rte_compForm).append(rte_toolbar2);

            var rte_clean = $('<img class="intLink" title="Clean" src="data:image/gif;base64,R0lGODlhFgAWAIQbAD04KTRLYzFRjlldZl9vj1dusY14WYODhpWIbbSVFY6O7IOXw5qbms+wUbCztca0ccS4kdDQjdTLtMrL1O3YitHa7OPcsd/f4PfvrvDv8Pv5xv///////////////////yH5BAEKAB8ALAAAAAAWABYAAAV84CeOZGmeaKqubMteyzK547QoBcFWTm/jgsHq4rhMLoxFIehQQSAWR+Z4IAyaJ0kEgtFoLIzLwRE4oCQWrxoTOTAIhMCZ0tVgMBQKZHAYyFEWEV14eQ8IflhnEHmFDQkAiSkQCI2PDC4QBg+OAJc0ewadNCOgo6anqKkoIQA7" />').
                click(function() {
                    if(validateMode()&&confirm('Are you sure?')) {
                        oDoc.innerHTML=sDefTxt
                    };
                });
            $(rte_toolbar2).append(rte_clean);

            var rte_print = $('<img class="intLink" title="Print" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABGdBTUEAALGPC/xhBQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9oEBxcZFmGboiwAAAAIdEVYdENvbW1lbnQA9syWvwAAAuFJREFUOMvtlUtsjFEUx//n3nn0YdpBh1abRpt4LFqtqkc3jRKkNEIsiIRIBBEhJJpKlIVo4m1RRMKKjQiRMJRUqUdKPT71qpIpiRKPaqdF55tv5vvusZjQTjOlseUkd3Xu/3dPzusC/22wtu2wRn+jG5So/OCDh8ycMJDflehMlkJkVK7KUYN+ufzA/RttH76zaVocDptRxzQtNi3mRWuPc+6cKtlXZ/sddP2uu9uXlmYXZ6Qm8v4Tz8lhF1H+zDQXt7S8oLMXtbF4e8QaFHjj3kbP2MzkktHpiTjp9VH6iHiA+whtAsX5brpwueMGdONdf/2A4M7ukDs1JW662+XkqTkeUoqjKtOjm2h53YFL15pSJ04Zc94wdtibr26fXlC2mzRvBccEbz2kiRFD414tKMlEZbVGT33+qCoHgha81SWYsew0r1uzfNylmtpx80pngQQ91LwVk2JGvGnfvZG6YcYRAT16GFtW5kKKfo1EQLtfh5Q2etT0BIWF+aitq4fDbk+ImYo1OxvGF03waFJQvBCkvDffRyEtxQiFFYgAZTHS0zwAGD7fG5TNnYNTp8/FzvGwJOfmgG7GOx0SAKKgQgDMgKBI0NJGMEImpGDk5+WACEwEd0ywblhGUZ4Hw5OdUekRBLT7DTgdEgxACsIznx8zpmWh7k4rkpJcuHDxCul6MDsmmBXDlWCH2+XozSgBnzsNCEE4euYV4pwCpsWYPW0UHDYBKSWu1NYjENDReqtKjwn2+zvtTc1vMSTB/mvev/WEYSlASsLimcOhOBJxw+N3aP/SjefNL5GePZmpu4kG7OPr1+tOfPyUu3BecWYKcwQcDFmwFKAUo90fhKDInBCAmvqnyMgqUEagQwCoHBDc1rjv9pIlD8IbVkz6qYViIBQGTJPx4k0XpIgEZoRN1Da0cij4VfR0ta3WvBXH/rjdCufv6R2zPgPH/e4pxSBCpeatqPrjNiso203/5s/zA171Mv8+w1LOAAAAAElFTkSuQmCC">').
                click(function() {
                     printDoc();
                });
            $(rte_toolbar2).append(rte_print);

            var rte_undo = $('<img class="intLink" title="Undo" src="data:image/gif;base64,R0lGODlhFgAWAOMKADljwliE33mOrpGjuYKl8aezxqPD+7/I19DV3NHa7P///////////////////////yH5BAEKAA8ALAAAAAAWABYAAARR8MlJq7046807TkaYeJJBnES4EeUJvIGapWYAC0CsocQ7SDlWJkAkCA6ToMYWIARGQF3mRQVIEjkkSVLIbSfEwhdRIH4fh/DZMICe3/C4nBQBADs=" />').
                click(function() {
                     formatDoc('undo');
                });
            $(rte_toolbar2).append(rte_undo);

            var rte_redo = $('<img class="intLink" title="Redo" src="data:image/gif;base64,R0lGODlhFgAWAMIHAB1ChDljwl9vj1iE34Kl8aPD+7/I1////yH5BAEKAAcALAAAAAAWABYAAANKeLrc/jDKSesyphi7SiEgsVXZEATDICqBVJjpqWZt9NaEDNbQK1wCQsxlYnxMAImhyDoFAElJasRRvAZVRqqQXUy7Cgx4TC6bswkAOw==" />').
                click(function() {
                    formatDoc('redo');
                });
            $(rte_toolbar2).append(rte_redo);

            var rte_removeFormat = $('<img class="intLink" title="Remove formatting" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABGdBTUEAALGPC/xhBQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAAd0SU1FB9oECQMCKPI8CIIAAAAIdEVYdENvbW1lbnQA9syWvwAAAuhJREFUOMtjYBgFxAB501ZWBvVaL2nHnlmk6mXCJbF69zU+Hz/9fB5O1lx+bg45qhl8/fYr5it3XrP/YWTUvvvk3VeqGXz70TvbJy8+Wv39+2/Hz19/mGwjZzuTYjALuoBv9jImaXHeyD3H7kU8fPj2ICML8z92dlbtMzdeiG3fco7J08foH1kurkm3E9iw54YvKwuTuom+LPt/BgbWf3//sf37/1/c02cCG1lB8f//f95DZx74MTMzshhoSm6szrQ/a6Ir/Z2RkfEjBxuLYFpDiDi6Af///2ckaHBp7+7wmavP5n76+P2ClrLIYl8H9W36auJCbCxM4szMTJac7Kza////R3H1w2cfWAgafPbqs5g7D95++/P1B4+ECK8tAwMDw/1H7159+/7r7ZcvPz4fOHbzEwMDwx8GBgaGnNatfHZx8zqrJ+4VJBh5CQEGOySEua/v3n7hXmqI8WUGBgYGL3vVG7fuPK3i5GD9/fja7ZsMDAzMG/Ze52mZeSj4yu1XEq/ff7W5dvfVAS1lsXc4Db7z8C3r8p7Qjf///2dnZGxlqJuyr3rPqQd/Hhyu7oSpYWScylDQsd3kzvnH738wMDzj5GBN1VIWW4c3KDon7VOvm7S3paB9u5qsU5/x5KUnlY+eexQbkLNsErK61+++VnAJcfkyMTIwffj0QwZbJDKjcETs1Y8evyd48toz8y/ffzv//vPP4veffxpX77z6l5JewHPu8MqTDAwMDLzyrjb/mZm0JcT5Lj+89+Ybm6zz95oMh7s4XbygN3Sluq4Mj5K8iKMgP4f0////fv77//8nLy+7MCcXmyYDAwODS9jM9tcvPypd35pne3ljdjvj26+H2dhYpuENikgfvQeXNmSl3tqepxXsqhXPyc666s+fv1fMdKR3TK72zpix8nTc7bdfhfkEeVbC9KhbK/9iYWHiErbu6MWbY/7//8/4//9/pgOnH6jGVazvFDRtq2VgiBIZrUTIBgCk+ivHvuEKwAAAAABJRU5ErkJggg==">').
                click(function() {
                     formatDoc('removeFormat');
                });
            $(rte_toolbar2).append(rte_removeFormat);

            var rte_bold = $('<img class="intLink" title="Bold" src="data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAInhI+pa+H9mJy0LhdgtrxzDG5WGFVk6aXqyk6Y9kXvKKNuLbb6zgMFADs=" />').
                click(function() {
                    formatDoc('bold');
                });
            $(rte_toolbar2).append(rte_bold);

            var rte_italic = $('<img class="intLink" title="Italic" src="data:image/gif;base64,R0lGODlhFgAWAKEDAAAAAF9vj5WIbf///yH5BAEAAAMALAAAAAAWABYAAAIjnI+py+0Po5x0gXvruEKHrF2BB1YiCWgbMFIYpsbyTNd2UwAAOw==" />').
                click(function() {
                    formatDoc('italic');
                });
            $(rte_toolbar2).append(rte_italic);

            var rte_underline = $('<img class="intLink" title="Underline" src="data:image/gif;base64,R0lGODlhFgAWAKECAAAAAF9vj////////yH5BAEAAAIALAAAAAAWABYAAAIrlI+py+0Po5zUgAsEzvEeL4Ea15EiJJ5PSqJmuwKBEKgxVuXWtun+DwxCCgA7" />').
                click(function() {
                    formatDoc('underline');
                });
            $(rte_toolbar2).append(rte_underline);

            var rte_justifyleft = $('<img class="intLink" title="Left align" onclick="formatDoc(\'justifyleft\');" src="data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAIghI+py+0Po5y02ouz3jL4D4JMGELkGYxo+qzl4nKyXAAAOw==" />').
                click(function() {
                    formatDoc('justifyleft');
                });
            $(rte_toolbar2).append(rte_justifyleft);

            var rte_justifycenter = $('<img class="intLink" title="Center align" src="data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAIfhI+py+0Po5y02ouz3jL4D4JOGI7kaZ5Bqn4sycVbAQA7" />').
                click(function() {
                     formatDoc('justifycenter');
                });
            $(rte_toolbar2).append(rte_justifycenter);

            var rte_justifyright = $('<img class="intLink" title="Right align" src="data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAIghI+py+0Po5y02ouz3jL4D4JQGDLkGYxouqzl43JyVgAAOw==" />').
                click(function() {
                    formatDoc('justifyright');
                });
            $(rte_toolbar2).append(rte_justifyright);

            var rte_insertorderedlist = $('<img class="intLink" title="Numbered list" src="data:image/gif;base64,R0lGODlhFgAWAMIGAAAAADljwliE35GjuaezxtHa7P///////yH5BAEAAAcALAAAAAAWABYAAAM2eLrc/jDKSespwjoRFvggCBUBoTFBeq6QIAysQnRHaEOzyaZ07Lu9lUBnC0UGQU1K52s6n5oEADs=" />').
                click(function() {
                    formatDoc('insertorderedlist');
                });
            $(rte_toolbar2).append(rte_insertorderedlist);

            var rte_insertunorderedlist = $('<img class="intLink" title="Dotted list" src="data:image/gif;base64,R0lGODlhFgAWAMIGAAAAAB1ChF9vj1iE33mOrqezxv///////yH5BAEAAAcALAAAAAAWABYAAAMyeLrc/jDKSesppNhGRlBAKIZRERBbqm6YtnbfMY7lud64UwiuKnigGQliQuWOyKQykgAAOw==" />').
                click(function() {
                    formatDoc('insertunorderedlist');
                });
            $(rte_toolbar2).append(rte_insertunorderedlist);

            var rte_blockquote = $('<img class="intLink" title="Quote" src="data:image/gif;base64,R0lGODlhFgAWAIQXAC1NqjFRjkBgmT9nqUJnsk9xrFJ7u2R9qmKBt1iGzHmOrm6Sz4OXw3Odz4Cl2ZSnw6KxyqO306K63bG70bTB0rDI3bvI4P///////////////////////////////////yH5BAEKAB8ALAAAAAAWABYAAAVP4CeOZGmeaKqubEs2CekkErvEI1zZuOgYFlakECEZFi0GgTGKEBATFmJAVXweVOoKEQgABB9IQDCmrLpjETrQQlhHjINrTq/b7/i8fp8PAQA7" />').
                click(function() {
                    formatDoc('formatblock','blockquote');
                });
            $(rte_toolbar2).append(rte_blockquote);

            var rte_outdent = $('<img class="intLink" title="Add indentation" src="data:image/gif;base64,R0lGODlhFgAWAMIHAAAAADljwliE35GjuaezxtDV3NHa7P///yH5BAEAAAcALAAAAAAWABYAAAM2eLrc/jDKCQG9F2i7u8agQgyK1z2EIBil+TWqEMxhMczsYVJ3e4ahk+sFnAgtxSQDqWw6n5cEADs=" />').
                click(function() {
                    formatDoc('outdent');
                });
            $(rte_toolbar2).append(rte_outdent);

            var rte_indent = $('<img class="intLink" title="Delete indentation" src="data:image/gif;base64,R0lGODlhFgAWAOMIAAAAADljwl9vj1iE35GjuaezxtDV3NHa7P///////////////////////////////yH5BAEAAAgALAAAAAAWABYAAAQ7EMlJq704650B/x8gemMpgugwHJNZXodKsO5oqUOgo5KhBwWESyMQsCRDHu9VOyk5TM9zSpFSr9gsJwIAOw==" />').
                click(function() {
                    formatDoc('indent');
                });
            $(rte_toolbar2).append(rte_indent);

            var rte_createlink = $('<img class="intLink" title="Hyperlink" src="data:image/gif;base64,R0lGODlhFgAWAOMKAB1ChDRLY19vj3mOrpGjuaezxrCztb/I19Ha7Pv8/f///////////////////////yH5BAEKAA8ALAAAAAAWABYAAARY8MlJq7046827/2BYIQVhHg9pEgVGIklyDEUBy/RlE4FQF4dCj2AQXAiJQDCWQCAEBwIioEMQBgSAFhDAGghGi9XgHAhMNoSZgJkJei33UESv2+/4vD4TAQA7" />').
                click(function() {
                    var sLnk=prompt('Write the URL here','http://');
                    if(sLnk&&sLnk!=''&&sLnk!='http://') {
                        formatDoc('createlink',sLnk)
                    }
                });
            $(rte_toolbar2).append(rte_createlink);

            // TODO rename and make proper icon for adding a Systo widget
            var rte_insertHtml = $('<img class="intLink" title="insertHTML" src="data:image/gif;base64,R0lGODlhFgAWAOMKAB1ChDRLY19vj3mOrpGjuaezxrCztb/I19Ha7Pv8/f///////////////////////yH5BAEKAA8ALAAAAAAWABYAAARY8MlJq7046827/2BYIQVhHg9pEgVGIklyDEUBy/RlE4FQF4dCj2AQXAiJQDCWQCAEBwIioEMQBgSAFhDAGghGi9XgHAhMNoSZgJkJei33UESv2+/4vD4TAQA7" />').
                click(function() {
                    insertHtml();
                });
            $(rte_toolbar2).append(rte_insertHtml);

            // TODO rename and make proper icon for adding a break
            var rte_insertBreak = $('<img class="intLink" title="insertHTML" src="data:image/gif;base64,R0lGODlhFgAWAOMKAB1ChDRLY19vj3mOrpGjuaezxrCztb/I19Ha7Pv8/f///////////////////////yH5BAEKAA8ALAAAAAAWABYAAARY8MlJq7046827/2BYIQVhHg9pEgVGIklyDEUBy/RlE4FQF4dCj2AQXAiJQDCWQCAEBwIioEMQBgSAFhDAGghGi9XgHAhMNoSZgJkJei33UESv2+/4vD4TAQA7" />').
                click(function() {
                   insertBreak();
                });
            $(rte_toolbar2).append(rte_insertBreak);

            // TODO rename and make proper icon for adding a table
            var rte_insertTable = $('<img class="intLink" title="insertHTML" src="data:image/gif;base64,R0lGODlhFgAWAOMKAB1ChDRLY19vj3mOrpGjuaezxrCztb/I19Ha7Pv8/f///////////////////////yH5BAEKAA8ALAAAAAAWABYAAARY8MlJq7046827/2BYIQVhHg9pEgVGIklyDEUBy/RlE4FQF4dCj2AQXAiJQDCWQCAEBwIioEMQBgSAFhDAGghGi9XgHAhMNoSZgJkJei33UESv2+/4vD4TAQA7" />').
                click(function() {
                    insertTable();
                });
            $(rte_toolbar2).append(rte_insertTable);

/*  These 3 commands of the rich-text editing command set have been removed because they
    *do not work* without the user changing some security settings in their browser.
    See the documentation for the cut,copy and paste commands here: 
        http://www-archive.mozilla.org/editor/midas-spec.html
    and the page pointed to in those 3 sections, which is here: 
        https://developer.mozilla.org/en-US/docs/Midas/Security_preferences

            var rte_cut = $('<img class="intLink" title="Cut" src="data:image/gif;base64,R0lGODlhFgAWAIQSAB1ChBFNsRJTySJYwjljwkxwl19vj1dusYODhl6MnHmOrpqbmpGjuaezxrCztcDCxL/I18rL1P///////////////////////////////////////////////////////yH5BAEAAB8ALAAAAAAWABYAAAVu4CeOZGmeaKqubDs6TNnEbGNApNG0kbGMi5trwcA9GArXh+FAfBAw5UexUDAQESkRsfhJPwaH4YsEGAAJGisRGAQY7UCC9ZAXBB+74LGCRxIEHwAHdWooDgGJcwpxDisQBQRjIgkDCVlfmZqbmiEAOw==" />').
                click(function() {
                   formatDoc('cut');
                });
            $(rte_toolbar2).append(rte_cut);

            var rte_copy = $('<img class="intLink" title="Copy" src="data:image/gif;base64,R0lGODlhFgAWAIQcAB1ChBFNsTRLYyJYwjljwl9vj1iE31iGzF6MnHWX9HOdz5GjuYCl2YKl8ZOt4qezxqK63aK/9KPD+7DI3b/I17LM/MrL1MLY9NHa7OPs++bx/Pv8/f///////////////yH5BAEAAB8ALAAAAAAWABYAAAWG4CeOZGmeaKqubOum1SQ/kPVOW749BeVSus2CgrCxHptLBbOQxCSNCCaF1GUqwQbBd0JGJAyGJJiobE+LnCaDcXAaEoxhQACgNw0FQx9kP+wmaRgYFBQNeAoGihCAJQsCkJAKOhgXEw8BLQYciooHf5o7EA+kC40qBKkAAAGrpy+wsbKzIiEAOw==" />').
                click(function() {
                     formatDoc('copy');
                });
            $(rte_toolbar2).append(rte_copy);

            var rte_paste = $('<img class="intLink" title="Paste" src="data:image/gif;base64,R0lGODlhFgAWAIQUAD04KTRLY2tXQF9vj414WZWIbXmOrpqbmpGjudClFaezxsa0cb/I1+3YitHa7PrkIPHvbuPs+/fvrvv8/f///////////////////////////////////////////////yH5BAEAAB8ALAAAAAAWABYAAAWN4CeOZGmeaKqubGsusPvBSyFJjVDs6nJLB0khR4AkBCmfsCGBQAoCwjF5gwquVykSFbwZE+AwIBV0GhFog2EwIDchjwRiQo9E2Fx4XD5R+B0DDAEnBXBhBhN2DgwDAQFjJYVhCQYRfgoIDGiQJAWTCQMRiwwMfgicnVcAAAMOaK+bLAOrtLUyt7i5uiUhADs=" />').
                click(function() {
                    formatDoc('paste');
                });
            $(rte_toolbar2).append(rte_paste);
*/
            var rte_editMode = $('<div id="editMode"></div>');
            var rte_editMode1 = $('<div style="width:20px; float:left;">&nbsp;&nbsp;</div>');
            var rte_editMode2 = $('<input type="checkbox" name="switchMode" id="switchBox" style="margin-right:0px;"/>').
                click(function() {
                    setDocMode(this.checked);
                });
            var rte_editMode3 = $('<label for="switchBox" style="font-size:14px;">HTML</label>');
            $(rte_editMode).append(rte_editMode1).append(rte_editMode2).append(rte_editMode3);
            $(rte_toolbar2).append(rte_editMode);

            //var html = getHtml();

            //$(div).append(html);

            this._container = $(this.element).append(div);

            $('.intLink').css({float:'left'});
            initDoc();

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('rich_text_editor-1');
            this.element.empty();
            this._super();
        },
        _setOption: function (key, value) {
            var self = this;
            var prev = this.options[key];
            var fnMap = {
            };

            // base
            this._super(key, value);

            if (key in fnMap) {
                fnMap[key]();

                // Fire event
                this._triggerOptionChanged(key, prev, value);
            }
        },

        _triggerOptionChanged: function (optionKey, previousValue, currentValue) {
            this._trigger('setOption', {type: 'setOption'}, {
                option: optionKey,
                previous: previousValue,
                current: currentValue
            });
        }
    });


function initDoc() {
  oDoc = document.getElementById("workspace");
  sDefTxt = oDoc.innerHTML;
  if (document.compForm.switchMode.checked) { setDocMode(true); }
}

function insertBreak() {
    formatDoc('insertHTML','<br clear="all"/>');
}

function insertTable() {
    formatDoc('insertHTML',
        '<table>'+
            '<tr>'+
                '<td style="border:solid 1px red">AA</td>'+
                '<td style="border:solid 1px red">BB</td>'+
            '</tr>'+
            '<tr>'+
                '<td style="border:solid 1px red">CC</td>'+
                '<td style="border:solid 1px red">DD</td>'+
            '</tr>'+
        '</table>');
}


// From http://stackoverflow.com/questions/6690752/insert-html-at-caret-in-a-contenteditable-div/6691294#6691294
// with thanks!
// But note: the undo/redo mechanism DOES NOT WORK for this, so I use it only when absolutely necessary (inline_value).

function pasteHtmlAtCaret(html) {
    var sel, range;
    if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();

            // Range.createContextualFragment() would be useful here but is
            // only relatively recently standardized and is not supported in
            // some browsers (IE9, for one)
            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(), node, lastNode;
            while ( (node = el.firstChild) ) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);

            // Preserve the selection
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    } else if (document.selection && document.selection.type != "Control") {
        // IE < 9
        document.selection.createRange().pasteHTML(html);
    }
}


function insertHtmlxxx() {
    var html = '<span>hello</span>';
    pasteHtmlAtCaret(html);
}


function insertHtml() {
    counter += 1;
    var packageId = $('#select_package').val();
    var modelId = $('#select_model').val();
    var widgetId = $('#select_widget').val();
    WIDGET_LIST['widget_div'+counter] = {packageId:packageId, modelId:modelId, widgetId:widgetId};
    console.debug('insertHtml '+counter+'     package: '+packageId+'; model: '+modelId+'; widget: '+widgetId);

    if (widgetId === 'inline_value') {
        pasteHtmlAtCaret('<span id="widget_div'+counter+'"></span>');
        handleWidget(widgetId, 'widget_div'+counter, packageId, modelId);
        // Note: there is something wrong with execComamnd('insertHTNL',false,'<span>...</span>') in Chrome
        // Firefox seems OK.   - it's just
        // not inserting the span element.  The following are relics of trying this.
        //formatDoc('insertHTML','<div style="height:30px; width:50px;background-color:yellow;">5555</div>'
            //'<span id="widget_div'+counter+'" class="inline_value-1">8888'+
                //'<span>777'+
                    //'<span class="inline_value">0.3333</span>'+
                    //'<span class="display_listener" style="display:none;">Click me!</span>'+
                //'</span>'+
            //'</span>'
        //);
        //document.execCommand('insertHTML', false, '<span>5555</span>');
    } else {
        formatDoc('insertHTML','<div id="widget_outerdiv'+counter+'" style="float:left;padding:5px; background-color:white;"></div>');
        var widgetMiddlediv = $('<div id="widget_middlediv'+counter+'" class="systo_widget" style="position:relative; border:solid 1px black; margin:10px; background-color:white;"></div>');
        var widgetDiv = $('<div id="widget_div'+counter+'" class="systo_widget" style="position:relative;"></div>');
        var deleteButton = $('<div class="widget_button" style="position:absolute; top:-17px; background:yellow; z-index:10000; font-size:13px; display:none;">Delete</div>').
            click(function(event) {
                $(this).parent().parent().remove();  // TODO: Should delete the actual widget as 
                                // well! (unless deleting the containing div is enough...)
            });
        $('#widget_outerdiv'+counter).append(widgetMiddlediv);
        $('#widget_middlediv'+counter).append(deleteButton).append(widgetDiv);
        $('#widget_outerdiv'+counter).
            mouseenter(function(event) {
                $(this).css({'background-color':'yellow'});
                $(this).find('.widget_button').css({display:'block'});
                event.stopPropagation();
            }).
            mouseleave(function(event) {
                $(this).css({'background-color':'white'});
                $(this).find('.widget_button').css({display:'none'});
            });
        handleWidget(widgetId, 'widget_div'+counter, packageId, modelId);
    }


        SYSTO.switchToModel(modelId);

/*
                SYSTO.trigger(
                    'pagemaker.html',
                    '#workspace mousedown',
                    'change_model_listener',
                    'click',
                    [{  packageId:SYSTO.state.currentPackageId,
                        oldModelId:'',
                        newModelId:SYSTO.state.currentModelId}]
                );
                SYSTO.trigger(
                    'pagemaker.html',
                    '#workspace mousedown',
                    'display_listener',
                    'click',
                    [{  packageId:SYSTO.state.currentPackageId,
                        modelId:SYSTO.state.currentModelId
                    }]
                );
*/


}

function formatDoc(sCmd, sValue) {
  if (validateMode()) { document.execCommand(sCmd, false, sValue); oDoc.focus(); }
}

function validateMode() {
  if (!document.compForm.switchMode.checked) { return true ; }
  alert("Uncheck \"Show HTML\".");
  oDoc.focus();
  return false;
}

function setDocMode(bToSource) {
  var oContent;
  if (bToSource) {
    oContent = document.createTextNode(oDoc.innerHTML);
    oDoc.innerHTML = "";
    var oPre = document.createElement("pre");
    oDoc.contentEditable = false;
    oPre.id = "sourceText";
    oPre.contentEditable = true;
    oPre.appendChild(oContent);
    oDoc.appendChild(oPre);
  } else {
    if (document.all) {
      oDoc.innerHTML = oDoc.innerText;
    } else {
      oContent = document.createRange();
      oContent.selectNodeContents(oDoc.firstChild);
      oDoc.innerHTML = oContent.toString();
    }
    oDoc.contentEditable = true;
  }
  oDoc.focus();
}

function printDoc() {
  if (!validateMode()) { return; }
  var oPrntWin = window.open("","_blank","width=450,height=470,left=400,top=100,menubar=yes,toolbar=no,location=no,scrollbars=yes");
  oPrntWin.document.open();
  oPrntWin.document.write("<!doctype html><html><head><title>Print<\/title><\/head><body onload=\"print();\">" + oDoc.innerHTML + "<\/body><\/html>");
  oPrntWin.document.close();
}


function capture() {
    $('#workspace').attr('contenteditable','false');
    console.debug($('#workspace').html());
}



function handleWidget(widgetId, newDivId, packageId, modelId) {
    switch(widgetId) {

        case 'audio_plotter':
            $('#'+newDivId).css({height:'auto', width:'250px'});
            $('#'+newDivId).audio_plotter({
                modelId:modelId,
                includeNodeId: function(nodeId) {
                    var node = SYSTO.models[modelId].nodes[nodeId];
                    if (node.type === 'stock') {
                        return true;
                    } else {
                        return false;
                    }
                }
            });
            break;

        case 'diagram':
            $('#'+newDivId).css({height:'200px', width:'300px'});
            $('#'+newDivId).diagram({packageId:packageId, modelId:modelId, allowEditing:false, scale:0.5});
            break;

        case 'equation_listing':
            //$('#'+newDivId).css({height:'320px', width:'auto', overflow:'auto'});
            $('#'+newDivId).css({height:'auto', width:'auto'});
            $('#'+newDivId).equation_listing({packageId:packageId, modelId:modelId});
            break;

        case 'inline_value':
            $('#'+newDivId).inline_value({packageId:packageId, modelId:modelId, nodeId:'stock1', statistic:'final'});
            break;

        case 'local_open':
                   $('#'+newDivId).local_open();
            break;

        case 'local_save':
                   $('#'+newDivId).local_save({modelId:modelId});
            break;

        case 'messages':
            $('#'+newDivId).messages();
            SYSTO.trigger({
                file:'jquery.rich_text_editor.js', 
                action:'handleWidget()  casemessages', 
                event_type: 'message_listener', 
                parameters:{message: '<p style="color:blue">This is an example of a message sent to the <b>messages</b> widget.</p><p>You can actually send any HTML.</p>'}
            });
            break;

        case 'multi_plotter':
            $('#'+newDivId).css({height:'300px', width:'700px'});
            $('#'+newDivId).multi_plotter({
                packageId:packageId,
                modelId:modelId, 
                active:true,
            });
            //SYSTO.simulate(model);
            SYSTO.trigger(
                'widget_presenter.html',
                'Displaying "multi_plotter" widget',
                'change_model_listener',
                'click',
                [{packageId:packageId, oldModelId:'', newModelId:modelId}]
            );
            SYSTO.trigger(
                'widget_presenter.html',
                'Displaying "multi_plotter" widget',
                'display_listener',
                'click',
                [{  packageId:packageId,
                    modelId:modelId,
                }]
            );
            break;

        case 'multiple_sliders1xxx':
            $('#'+newDivId).css({width:'360px', 'overflow-x':'hidden', 'overflow-y':'auto'});
            $('#'+newDivId).multiple_sliders1({
                packageId:packageId,
                modelId:modelId,
                selectNode:function (node) {
                    if (node.type==='variable' && isEmpty(node.inarcList)) {
                        return true;
                    } else {
                        return false;
                    }
                }
            });
            break;


        case 'multiple_sliders':
            $('#'+newDivId).css({width:'360px', height:'200px', 'overflow-x':'hidden', 'overflow-y':'auto','background-color':'white'});
            $('#'+newDivId).multiple_sliders({
                packageId:packageId,
                modelId:modelId
            });
            SYSTO.switchToModel(modelId, packageId);        
            break;

        case 'phase_plane' :
            $('#'+newDivId).css({height:'400px', width:'400px'});
            $('#'+newDivId).phase_plane({modelId:modelId, nodeIdx:'stock1', nodeIdy:'stock3'});
            break;

        case 'plotter':
            $('#'+newDivId).css({height:'340px', width:'550px'});
            $('#'+newDivId).plotter({
                packageId:packageId,
                modelId:modelId,
                allowChangeOfModel: true,
                canvasWidth:400, 
                canvasHeight:250,
                selectNode:function (node) {
                    if (node.type === 'stock') {
                        return true;
                    } else {

                        return false;
                    }
                }
            });
            break;

        case 'runcontrol':
            $('#'+newDivId).css({height:'auto', width:'280px'});
            $('#'+newDivId).runcontrol({modelId:modelId});
            break;

        case 'sketchgraph':
            $('#'+newDivId).css({height:'320px', width:'650px'});
            $('#'+newDivId).sketchgraph({
                        modelId: modelId,
                        nodeIdx: 'stock5',
                        nodeIdy: 'variable19'});
            break;

        case 'slider1':
            $('#'+newDivId).slider1({
                modelId:modelId, 
                label:'birth_rate', 
                value:0.5, 
                minval:0, 
                maxval:2});
            break;

        case 'table':
            $('#'+newDivId).css({height:'320px', width:'250px', overflow:'auto'});
            $('#'+newDivId).table({modelId:modelId});
            $('#'+newDivId).css({'overflow-x':'auto', 'overflow-y':'auto'});
            break;

        case 'technical':
            $('#'+newDivId).css({height:'320px', width:'auto'});
            $('#widget_container_caption').html('<i>Please note: not all tabs have useful content in this live example.</i>');

            $('#'+newDivId).technical();
            $('.technical-1').css({display:'block'});
            SYSTO.trigger({
                file:'jquery.rich_text_editor.js', 
                action:'case: technical', 
                event_type: 'technical_listener', 
                parameters: {}
            });
            break;

        case 'text_editor':
            $('#'+newDivId).css({'height':'320px', width:'250px', overflow:'auto'});
            $('#'+newDivId).text_editor();
            $('#'+newDivId).css({'overflow-x':'auto', 'overflow-y':'auto'});
            break;

        case 'text_plotter':
            $('#'+newDivId).css({'max-height':'320px', width:'auto', overflow:'auto'});
            $('#'+newDivId).text_plotter({modelId:modelId});
            break;

        case 'toolbar':
            $('#'+newDivId).css({'height':'190px', width:'200px'});
            $('#'+newDivId).toolbar({
                languageId:SYSTO.models.miniworld.meta.language,
                modelId:modelId,
                show_button_language:true,
                show_button_new:true,
                show_button_open:true,
                show_button_save:true,
                show_button_tutorial:true,
                show_button_technical:true
            });

            break;

                default: 
        }       
    console.debug(111);
    if (widgetId !== 'inline_value') {
        console.debug(222);
        $('#'+newDivId).resizable();
    }
}


})(jQuery);
