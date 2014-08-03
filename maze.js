function Stack(){
		this.els = [];
	}
	
	Stack.prototype = {
	
		push: function( el ){
			this.els.push( el );
		},
		
		peek: function(){
			if( this.els.length > 0 ){
				return this.els[ this.els.length - 1 ];
			}else{
				return null;
			}
		},
		
		pop: function(){
			var el = this.els[ this.els.length - 1 ];
			this.els = this.els.slice( 0, this.els.length - 1 );
			return el;
		},
		
		size: function(){
			return this.els.length;
		}
	
	};
	
	function Cell( i, j, size ){
		this.i = i;
		this.j = j;
		this.visited = false;
		this.size = size;
		this.east = true;
		this.west = true;
		this.north = true;
		this.south = true;
		this.PI2 = 2 * Math.PI;
		this.mesh = {};
		this.collide = {
			'east': false,
			'west': false,
			'north': false,
			'south': false
		};
	}
	
	
	Cell.prototype = {
	
		paint: function(){
			var x, y;
			if( this.east ){
				x = this.j * this.size;
				y = this.i * this.size;
				this.drawWall(  x + this.size, y, x + this.size, y + this.size, 'east' );
			}
			 if( this.west ){
				x = this.j * this.size;
				y = this.i * this.size;
				this.drawWall(  x, y, x, y + this.size, 'west' );
			}
			if( this.north ){
				x = this.j * this.size;
				y = this.i * this.size;
				this.drawWall( x, y, x + this.size, y, 'north' );
			}
			if( this.south ){
				x = this.j * this.size;
				y = this.i * this.size;
				this.drawWall( x, y + this.size, x + this.size, y + this.size, 'south' );
			}
			
				
		},
		
		
		paint2D: function( g, scale ){


			// camera drawing

				var camX = camera.position.x * scale + 100, 
				camY = camera.position.z * scale + 100;

				var angle = -camera.rotation.y - Math.PI / 2,
							amount = 10;

						g.save();
						g.translate( camX, camY );
						g.rotate( angle - Math.PI / 2 );
						g.drawImage( youImage, -youImage.width / 2, -youImage.height / 2 );
						g.rotate( -angle + Math.PI / 2 );
						g.translate( -camX, -camY );	
						g.restore();


			// wall drawing
			var x, y;
			if( this.east ){
				x = this.j * this.size;
				y = this.i * this.size;
				this.drawWall2D( g, scale,  x + this.size, y, x + this.size, y + this.size, 'east' );
			}
			 if( this.west ){
				x = this.j * this.size;
				y = this.i * this.size;
				this.drawWall2D( g, scale, x, y, x, y + this.size, 'west' );
			}
			if( this.north ){
				x = this.j * this.size;
				y = this.i * this.size;
				this.drawWall2D( g, scale, x, y, x + this.size, y, 'north' );
			}
			if( this.south ){
				x = this.j * this.size;
				y = this.i * this.size;
				this.drawWall2D( g, scale, x, y + this.size, x + this.size, y + this.size, 'south' );
			}
			
			// camera position
			
		
				/*

						
						g.arc( camX, camY, 3, 0, this.PI2 ,true );
						g.fillStyle= '#DB0058';
						g.fill();
						
			
						
						// draw camera direction
						
						g.beginPath();
						
						var dirCos = Math.cos( angle + Math.PI / 8 ),
							dirSin = Math.sin( angle + Math.PI / 8 ),
							dirCosR = Math.cos( angle - Math.PI / 8 ),
							dirSinR = Math.sin( angle - Math.PI / 8 );
						
						g.moveTo( camX, camY );	
						g.lineTo( camX + amount * dirCosR ,camY + amount * dirSinR );
						
						g.moveTo( camX, camY );	
						g.lineTo( camX + amount * dirCos ,camY + amount * dirSin );
						
						g.lineTo( camX + amount * dirCosR ,camY + amount * dirSinR );
						
						g.fill();
						
						g.closePath();
						
					*/	
						
			// end point	
			
			var endX = endPLight.position.x * scale + 100, 
				endY = endPLight.position.z * scale + 100;		
				

						g.save();
						g.translate( endX, endY );
						g.drawImage( finishImage, -finishImage.width / 2, -finishImage.height / 2 );
						g.translate( -endX, -endY );	
						g.restore();

			/*
				g.beginPath();	
				g.arc( endX, endY, 5, 0, this.PI2 ,true );
				g.fillStyle= '#AE20C7';
				g.fill();
				g.closePath();
			*/	
			
			
		},
		
		
		drawWall: function( x, y, x2, y2, dir ){
						
			var w = this.size;
			
			var angle = Math.atan2( y2 - y, x2 - x );
			
			var imgTexture = THREE.ImageUtils.loadTexture( "resources/brick.jpg" ); // ql3.jpg 
			imgTexture.repeat.set( 6, 12 );
			imgTexture.wrapS = imgTexture.wrapT = THREE.RepeatWrapping;
			
			var wallH = 1024;	
			
			var wallGeo = new THREE.CubeGeometry( w, wallH, 32 );
			
			var wallMaterial = new THREE.MeshPhongMaterial( { map: imgTexture, color: 0xffffff, ambient: 0xF0EFEF, specular: 0x999999, shininess: 15, perPixel: true, shading: THREE.SmoothShading } );
			
	        var wallMesh = new THREE.Mesh( wallGeo, wallMaterial );
			
			wallMesh.rotation.y = -angle;
				
			wallMesh.position.x = x - Math.abs( w / 2  * Math.sin( angle ) )  - mazeSize / 2 + w / 2 ;
			wallMesh.position.z = y - Math.abs( w / 2 * Math.cos( angle ) ) - mazeSize / 2  + w / 2;
			wallMesh.position.y += wallH / 2;	
			
			this.mesh[ dir ] = wallMesh;
			
			
			// spot light
			
//			var wallLight = new THREE.SpotLight( 0xFFFFFF, .3 );
//				wallLight.position.x = wallMesh.position.x + w;
//				wallLight.position.y = wallMesh.position.y + w;
//				wallLight.position.z = wallMesh.position.z;
//				
				//wallLight.rotation.y = wallMesh.rotation.y
//				wallLight.rotation.y = Math.PI;
//				scene.add( wallLight );
				
	        scene.add( wallMesh );
			
		},
		
		
		// this gives the distance between the line which lies from (x1, y1) to (x2, y2)
		// and the point (x3, y3) in two dimensional space
		getDistance: function( x1, y1, x2, y2, x3, y3 ){
			
			//  ||P2 - P1|| ^ 2
			
			var p2p1D = Math.pow( x2 - x1, 2 ) + Math.pow( y2 - y1, 2 ) ;
				
			var u = ( ( x3 - x1 ) * ( x2 - x1 ) + ( y3 - y1 ) * ( y2 - y1 ) ) / p2p1D;
			
			
			
			// the point which lies between P1 and P2
			var x = x1 + u * ( x2 - x1 );
			var y = y1 + u * ( y2 - y1 );
			
			
			if( u < 0 ){
				x = x1;
				y = y1;
			}else if( u > 1 ){
				x = x2;
				y = y2;
			}
			
			var distance = Math.sqrt( Math.pow( x3 - x, 2 ) + Math.pow( y3 - y, 2 ) );
			
			
			return distance;
			
		
		},
		
		
		drawWall2D: function( g, scale, x, y, x2, y2, direction ){
			// global context g variable used
				
				var xp1 = x * scale,
					yp1 = y * scale,
					xp2 = x2 * scale,
					yp2 = y2 * scale;
		
						
				
//				Collision with walls
//
//				var distance = this.getDistance( xp1, yp1, xp2, yp2, camX, camY );
//				
//				strokeColor = '#FFFFFF';
//				
//				var locations = {
//					'west': false,
//					'east': false,
//					'south': false,
//					'north': false
//				};
//				
//				
//				if( direction === 'west' || direction === 'east' ){
//					
//					if( xp1 < camX ){
//						locations.east = true;	
//					}else{
//						locations.west = true;
//					}
//					
//					if( ( yp1 >= camY && yp2 <= camY ) ||
//						( yp2 >= camY && yp1 <= camY )  ){
						// only west and east, neighborhood of wall
//					}else{
//						
//						if( yp1 < camY ){
//							locations.north = true;
//						}else{
//							locations.south = true;
//						}
//						
//					}
//					
//				}else{
//				
//				}
//				
			
				
							
				g.beginPath();
				
				g.moveTo( xp1, yp1 );
				g.lineTo( xp2, yp2 );

				g.strokeStyle = '#FFFFFF';
				
					
//				g.shadowColor = '#0f0';
//   			g.shadowBlur = 2;
   				
				g.stroke();
					
				g.closePath();
								
				
				
			
				
				
				
				
				
		}
		
		
		
	
	};

	function Maze( w, h, size ){
		this.cells = [];
		this.w = w;
		this.h = h;
		this.size = size;
		this.init();
		this.makeMaze();
	}
	
	
	
	Maze.prototype = {
	
		init: function(){
			var i = 0, j = 0;
			for( ; i < this.h; i += 1 ){
					this.cells.push([]);
				for( j = 0; j < this.w; j += 1 ){
					this.cells[i][j] = new Cell( i, j, this.size );
				}
			}
	 
		},
		
		paint: function(){
		
			var i = 0, j = 0;
			for( ; i < this.h; i += 1 ){
				for( j = 0; j < this.w; j += 1 ){
					this.cells[i][j].paint();
				}
			}
		
		},
		
		
		paint2D: function( g, scale ){
			g.clearRect( 0, 0, 200, 200 );
			
		
			var i = 0, j = 0;
			for( ; i < this.h; i += 1 ){
				for( j = 0; j < this.w; j += 1 ){
					this.cells[i][j].paint2D( g, scale );
				}
			}
						
		},
		

		collide: function( box1, box2 ){

			var cXmax = box1.max.x,  
				cXmin = box1.min.x,
				cYmax = box1.max.y, 
				cYmin = box1.min.y,
				cZmax = box1.max.z,
				cZmin = box1.min.z;

			var wXmax = box2.max.x,  // wall x max
					wXmin = box2.min.x,
					wYmax = box2.max.y,  // wall y max
					wYmin = box2.min.y,
					wZmax = box2.max.z,
					wZmin = box2.min.z;
				
				var xB = wXmin < cXmax && wXmax > cXmin,
					yB = wYmin < cYmax && wYmax > cYmin,
					zB = wZmin < cZmax && wZmax > cZmin; 

				return xB && yB && zB;
		},

		
		checkIntersections: function( movementUD, movementRL ){
			
			
			var angle = camera.rotation.y;
			
			var i = 0, j = 0;
				
				
			var collision = {
				'right': false,
				'left': false,
				'up': false,
				'down': false
			};

		
			cameraBox.geometry.computeBoundingBox();
		
		var cbox = cameraBox.geometry.boundingBox;
			
			cbox.max.addSelf( cameraBox.position );
			cbox.min.addSelf( cameraBox.position );



			cbox.max.addSelf( movementUD );
			cbox.min.addSelf( movementUD );

			cameraBox.geometry.boundingBox = false;

			cameraBox.geometry.computeBoundingBox();

		var cboxRL = cameraBox.geometry.boundingBox;
			
			cboxRL.max.addSelf( cameraBox.position );
			cboxRL.min.addSelf( cameraBox.position );

			cboxRL.max.addSelf( movementRL );
			cboxRL.min.addSelf( movementRL );	
			
		for( ; i < this.h; i += 1 ){
			for( j = 0; j < this.w; j += 1 ){
				
				var walls = this.cells[i][j].mesh;

				for( var dir in  walls){
					
					if( walls.hasOwnProperty( dir ) ){

					var wall = walls[ dir ];

					wall.geometry.computeBoundingBox();


					var angle = wall.rotation.y;
				
					var box = wall.geometry.boundingBox;

					if( wall.rotation.y !== 0 ){
						var temp = box.max.z;
						box.max.z = box.max.x;
						box.max.x = temp;

				   	 temp = box.min.z;
						box.min.z = box.min.x;
						box.min.x = temp;

					}

					box.max.addSelf( wall.position );
					box.min.addSelf( wall.position );
				
					if( this.collide( cbox, box )  ){
				
						collision.up = true;
						collision.down = true;
					}

					if( this.collide( cboxRL, box )  ){

						collision.left = true;
						collision.right = true;

					}

					}

				} // for
								
			}
			
		}
			

		
			return collision;
			
		},
		
		makeMaze: function() {
			
			var stack = new Stack();
			var total = this.w * this.h;
			var currentI =  ~~( Math.random() * this.h );
			var currentJ =	~~( Math.random() * this.w );
			var visited = 1;	
			var nC = 0;
			
			while( visited < total ){
				
				// pick unvisited neighbors				
				nC = this.getUnvisitedNeighborCount( currentI, currentJ );
				
				
				
				if( nC >= 1 ){
					
					var neighbors = this.getUnvisitedNeighbors( currentI, currentJ );
					
					var selected = neighbors[ ~~(Math.random() * neighbors.length) ];
					
					this.removeWallBetween( currentI, currentJ, selected );
					
					stack.push( this.cells[ currentI ][ currentJ ] );
					
					this.cells[ currentI ][ currentJ ].visited = true;
					selected.visited = true;
					
					currentI = selected.i;
					currentJ = selected.j;
					
					visited += 1;
				
				}else{
					
					var el = stack.pop();
					currentI = el.i;
					currentJ = el.j;
					
				}
			
			}
		},
		
		removeWallBetween: function( i, j ,neighbor ){
			
			
			if( i > 0 ){
				if( this.cells[ i - 1 ][ j ] === neighbor ){
					// north
					
					this.cells[ i ][ j ].north = false;
					neighbor.south =false;
				}
			}
			
			if( i < this.h - 1 ){
				if( this.cells[ i + 1 ][ j ]  === neighbor ){
					// south
					this.cells[ i ][ j ].south = false;
					neighbor.north =false;
				}
			}
			
			if( j > 0 ){
				if( this.cells[ i ][ j - 1 ] === neighbor ){
					// west
					this.cells[ i ][ j ].west = false;
					neighbor.east =false;
				}
			}
			
			if( j < this.w - 1 ){
				if( this.cells[ i ][ j + 1 ] === neighbor ){
					// east
					this.cells[ i ][ j ].east = false;
					neighbor.west =false;
				}
			}
			
			
			
		
		},
		
		getUnvisitedNeighborCount: function( i, j ) {
			var c = 0;
			
			if( i > 0 ){
				if( !this.cells[ i - 1 ][ j ].visited ){
					c += 1;
				}
			}
			
			if( i < this.h - 1 ){
				if( !this.cells[ i + 1 ][ j ].visited ){
					c += 1;
				}
			}
			
			if( j > 0 ){
				if( !this.cells[ i ][ j - 1 ].visited ){
					c += 1;
				}
			}
			
			if( j < this.w - 1 ){
				if( !this.cells[ i ][ j + 1 ].visited ){
					c += 1;
				}
			}
			
			return c;		
		},
		
		
		getUnvisitedNeighbors: function( i, j ) {
			var neighbors = [];
			
			if( i > 0 ){
				if( !this.cells[ i - 1 ][ j ].visited ){
					neighbors.push( this.cells[ i - 1 ][ j ] );
				}
			}
			
			if( i < this.h - 1 ){
				if( !this.cells[ i + 1 ][ j ].visited ){
					neighbors.push( this.cells[ i + 1 ][ j ] );
				}
			}
			
			if( j > 0 ){
				if( !this.cells[ i ][ j - 1 ].visited ){
					neighbors.push( this.cells[ i ][ j - 1 ] );
				}
			}
			
			if( j < this.w - 1 ){
				if( !this.cells[ i ][ j + 1 ].visited ){
					neighbors.push( this.cells[ i ][ j + 1 ] );
				}
			}
			
			return neighbors;		
		}
		
	
	};
