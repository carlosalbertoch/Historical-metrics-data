import vertexShader from './shaders/vertex.glsl.js';
import fragmentShader from './shaders/fragment.glsl.js';
import atmosphereVertexShader from './shaders/atmosphereVertex.glsl.js';
import atmosphereFragmentShader from './shaders/atmosphereFragment.glsl.js';
import gsap from "./node_modules/gsap/gsap-core.js";



console.log(vertexShader)
console.log(fragmentShader)
const WIDTH = innerWidth;
const HEIGHT = innerHeight;
const scene=new THREE.Scene();
const canvasContainer=document.querySelector('#canvasContainer')
const camera=new THREE.PerspectiveCamera(75, canvasContainer.offsetWidth / canvasContainer.offsetHeight, 0.1, 1000)
camera.position.z= 10;
const renderer=new THREE.WebGLRenderer({
    antialias:true,
    canvas: document.querySelector('canvas')
})

//renderer.setSize(WIDTH, HEIGHT)
renderer.setSize(canvasContainer.offsetWidth,canvasContainer.offsetHeight)
renderer.setPixelRatio(window.devicePixelRatio)
//const container = document.getElementById('region');
//container.appendChild(renderer.domElement );

//create a sphere1
const sphere=new THREE.Mesh(
    new THREE.SphereBufferGeometry(5,50,50),
    new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms:{
            globeTexture:{
                value:new THREE.TextureLoader().load('./img/globe.jpeg')
            }
        }
    })
)
//console.log(sphere)

//create a sphere2
const atmosphere=new THREE.Mesh(
    new THREE.SphereBufferGeometry(5,50,50),
    new THREE.ShaderMaterial({
        vertexShader: atmosphereVertexShader,
        fragmentShader:atmosphereFragmentShader,
        blending:THREE.AdditiveBlending,
        side: THREE.BackSide
    })
)
atmosphere.scale.set(1.1, 1.1, 1.1)
scene.add(atmosphere)

//group of sphere and atmosphere
const group =new THREE.Group()
group.add(sphere)


//create stars--


const starGeometry=new THREE.BufferGeometry()
const starMaterial=new THREE.PointsMaterial({
    color:0xffffff
})

const starVertices=[]
for (let i=0; i<6000; i++){
    const x= (Math.random()-0.5)*2000;
    const y=(Math.random()-0.5)*2000;
    const z=-Math.random()*1800;
    starVertices.push(x,y,z)
}

starGeometry.setAttribute('position',new THREE.Float32BufferAttribute(starVertices,3))
const stars= new THREE.Points(starGeometry,starMaterial)
scene.add(stars)

//---------------
//create points
function createPoint(lat,lng){
    const box=new  THREE.Mesh(
        new THREE.BoxGeometry(0.2,0.2,0.8),
        new THREE.MeshBasicMaterial({
            color:"#f5bf42",
            opacity:0.5,
            transparent:true
        })
    )
    const latitude=(lat/180)*Math.PI;
    const longitude=(lng/180)*Math.PI;
    const radius=5;
    const x= radius*Math.cos(latitude)*Math.sin(longitude);
    const y= radius*Math.sin(latitude);
    const z= radius*Math.cos(latitude)*Math.cos(longitude);
    box.position.x=x;
    box.position.y=y;
    box.position.z=z;
    box.lookAt(0,0,0)
    box.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0,0,-0.4))
    group.add(box);
    gsap.to(box.scale,{
        z:0,
        duration:5,
        yoyo:true,
        repeat:-1,
        ease:'linear',
        delay: Math.floor(Math.random()*(1+3-0.1)+0.1),
    })
    
    sphere.rotation.y=-Math.PI/2;
    sphere.rotation.x=Math.PI/16;

}

scene.add(group)
//---------------
//coordenates----
createPoint(19.432608, -99.133209);
createPoint(4.6243, -74.0636);
createPoint(-14.2350, -51.9253);
createPoint(48.864716, 2.349014);

//control mouse----
const mouse={
    x:undefined,
    y:undefined
}



const raycaster = new THREE.Raycaster();
console.log(raycaster);
console.log(group.children);
//const tip=document.querySelector('#tip')
//const tip = document.getElementById('tip').style;
//console.log(tip)
//animation function---
function animate(){
    requestAnimationFrame(animate)
    group.rotation.y-=0.004
    renderer.render(scene,camera) 

    console.log(group.rotation)

    //if (mouse.x){
    //gsap.to(group.rotation,{
        //x:-mouse.y*1.2,
        //y:mouse.x*1.2,
        //duration:2
        //})
    //}   
    //raycaster
    raycaster.setFromCamera( mouse, camera );
	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( group.children.filter((Mesh)=>{
        return Mesh.geometry.type === "BoxGeometry"
    }))
    group.children.forEach((Mesh)=>{
        Mesh.material.opacity=0.4
    })
	for ( let i = 0; i < intersects.length; i ++ ) {
        console.log(intersects)
        console.log(intersects[i].object.material.opacity=1)
        intersects[i].object.material.opacity=1;
		//intersects[ i ].object.material.color.set( 0xff0000 );
	}
	renderer.render( scene, camera ); 
}
animate()
//mouse events-----
addEventListener('mousemove',(e)=>{
    mouse.x=((e.clientX-innerWidth/2)/(innerWidth/2))*2-1;
    mouse.y=(e.clientY/innerHeight)*2-1;
    //gsap.set(tip,{
        //visibility:'visible'
        //x:e.clientX,
        //y:e.clientY 
    //})
    //mouse.x = ( (e.clientX -renderer.domElement.offsetLeft) / renderer.domElement.width ) * 2 - 1;
    //mouse.y = -( (e.clientY - renderer.domElement.offsetTop) / renderer.domElement.height ) * 2 + 1;
    //console.log(mouse.x)
})

