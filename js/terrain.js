
function Terrain = function(width, height) {

	this.heigth = heigth;
	this.width = width;
	
	this.terrainGeo = new THREE.Geometry;
	
	function buildTerrain() {
		terrainGeo = new THREE.Geometry();
		
		for (x = 0; x < width; x++) {
			for (y = 0; y<height; y++) {
			
				
			}
		}
				
	}
	
	function buildTerrainMesh() {
	
		var firstVertex = terrainGeo.vertices.length;
		
		
	}
	
	
	


}