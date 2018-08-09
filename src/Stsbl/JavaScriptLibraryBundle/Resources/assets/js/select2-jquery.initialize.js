/*
 * The MIT License
 *
 * Copyright 2018 Felix Jacobi.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * Handles the binding of the Select2 plugin.
 * 
 * Mostly same as the original in the CrudBundle but enhanced with jquery.initialize.js
 */
IServ.StsblJavaScript = {};


IServ.StsblJavaScript.Select2 = IServ.register(function(IServ) {

    function formatTag(tag, icon) {
        if (!tag.id) {
            return tag.text;
        }

        return $('<span>' + icon + tag.text + '</span>');
    }

    function register(e)
    {
        var $this = e;

        // Set overall defaults
        var options = {
            theme: 'bootstrap'
        };

        // Set lang
        // TODO: Set globally
        if (IServ.Locale.lang() != 'en') {
            options.language = IServ.Locale.lang();
        }

        // Allow clear for optional single choice
        if (!$this.attr('multiple') && !$this.attr('required')) {
            options.allowClear = true;

            // Check for placeholder
            if ($this.attr('placeholder')) {
                options.placeholder = $this.attr('placeholder');
            } else {                    // allowClear requires a placeholder!
                options.placeholder = _('Choose an option');
            }
        }

        // Add icon to tags
        if ($this.data('icon')) {
            var icon = IServ.Icon.get($this.data('icon'));
            options.templateSelection = function(tag) {
                return formatTag(tag, icon);
            };
        }

        if ($this.hasClass('select2-stacked')) {
            options.containerCssClass = 'select2-stacked';
        }

        // Init select2
        $this.select2(options);

        // Don't open on removing elements
        // @link https://github.com/select2/select2/issues/3320
        $this
            .on('select2:unselecting', function(e) {
                $this.data('unselecting', true);
            })
            .on('select2:open', function(e) { // note the open event is important
                if ($this.data('unselecting')) {
                    $this.removeData('unselecting'); // you need to unset this before close
                    $this.select2('close');
                }
            })
        ;    
    }
    
    function initialize(scope)
    {
        
        // Init select2
        $('select.select2', scope).each(function() {
            register($(this));
        });
        
        // Init select2 for elements which are dynamically added
        $('select.select2').initialize(function() {
            register($(this));
        });

        $(document).on('keydown', '.select2-container--focus', function (e) {
            // Check if "down" was pressed
            if (e.which == 40) {
                // select2 is bound to the original select-element which *should*
                // be the previous one in the DOM.
                $(this).prev().select2('open');
                e.preventDefault();
            }
        });
    }

    // Public API
    return {
        init: initialize
    };

}(IServ)); // end of IServ module
