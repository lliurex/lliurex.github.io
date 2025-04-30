function init_paletteColors(){
    let list_properties = Array.from(document.styleSheets)
   .filter(
     sheet =>
       sheet.href === null || sheet.href.startsWith(window.location.origin)
   )
   .reduce(
     (acc, sheet) =>
       (acc = [
         ...acc,
         ...Array.from(sheet.cssRules).reduce(
           (def, rule) =>
             (def =
               rule.selectorText === ":root"
                 ? [
                     ...def,
                     ...Array.from(rule.style).filter(name =>
                       name.startsWith("--")
                     )
                   ]
                 : def),
           []
         )
       ]),
     []
   );
   style = getComputedStyle(document.documentElement);
   let result = {};
   for ( element of list_properties ){
       result[element.substr(8,element.length)] = style.getPropertyValue(element);
   }
   return result;
 }
 
 function colorize_range(){
     let val = (this.value - this.getAttribute('min')) / ( this.getAttribute('max') - this.getAttribute('min'));
     let percentaje = val * 100;
     this.style.background = `linear-gradient(to right, ${paletteColors['plasmablue']} 0%,${paletteColors['plasmablue']} ${percentaje}%, ${paletteColors['lazygray']} ${percentaje}%, ${paletteColors['lazygray']} 100%)`;
 }
 
 var paletteColors = init_paletteColors();