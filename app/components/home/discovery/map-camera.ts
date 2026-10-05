/** Viewport stays entirely inside source bounds, including portrait/landscape resize. */
export const MIN_ZOOM = 1;
export const MAX_ZOOM = 32;
export type Camera = {x:number;y:number;zoom:number};
export function getView(camera:Camera, pixelWidth:number, pixelHeight:number, mapWidth:number, mapHeight:number){
 const pw=Math.max(1,pixelWidth),ph=Math.max(1,pixelHeight);
 const zoom=Math.max(MIN_ZOOM,Math.min(MAX_ZOOM,camera.zoom));
 // Cover rather than contain: never reveal canvas beyond the actual road data.
 const width=Math.min(mapWidth,mapHeight*pw/ph)/zoom;
 const height=width*ph/pw;
 const x=Math.max(width/2,Math.min(mapWidth-width/2,camera.x));
 const y=Math.max(height/2,Math.min(mapHeight-height/2,camera.y));
 return {x,y,width,height,left:x-width/2,top:y-height/2,zoom};
}
