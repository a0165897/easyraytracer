function render(){
    var canvas = document.getElementById("renderCanvas");
    var plane = new Plane(new vector3(0, 1, 0), 0);
    var sphere1 = new sphere(new vector3(-10, 10, -10), 10);
    var sphere2 = new sphere(new vector3(10, 10, -10), 10);
    plane.material = new checkerMaterial(0.1, 0.5);
    sphere1.material = new phongMaterial(color.red, color.white, 16, 0.25);
    sphere2.material = new phongMaterial(color.blue, color.white, 16, 0.25);
    rayTrace(
        canvas,
        new Union([plane, sphere1, sphere2]),
        new perspectiveCamera(new vector3(0, 5, 15), new vector3(0, 0, -1), new vector3(0, 1, 0), 90),
        3);
}

function rayTraceRecursive(scene, ray, maxReflect) {
    var result = scene.intersect(ray);

    if (result.geometry) {
        var reflectiveness = result.geometry.material.reflectiveness;
        var rcolor = result.geometry.material.sample(ray, result.position, result.normal);
        rcolor = rcolor.multiply(1 - reflectiveness);

        if (reflectiveness > 0 && maxReflect > 0) {
            var r = result.normal.multiply(-2 * result.normal.dot(ray.direction)).add(ray.direction);
            ray = new ray3(result.position, r);
            var reflectedColor = rayTraceRecursive(scene, ray, maxReflect - 1);
            rcolor = rcolor.add(reflectedColor.multiply(reflectiveness));
        }
        return rcolor;
    }
    else
        return color.black;
}

function rayTrace(canvas,scene,camera,maxReflect){
    //test canvas and provide a basic render notion
    var ctx = canvas.getContext("2d");
    var w = canvas.width;
    var h = canvas.height;
    ctx.fillStyle="rgb(0,0,0)";
    ctx.fillRect(0,0,w,h);
    var imgdata = ctx.getImageData(0,0,w,h);
    var pixels = imgdata.data;
    scene.initialize();
    camera.initialize();
    var i = 0;
    for (var y = 0; y < h; y++) {
        var sy = 1 - y / h;
        for (var x = 0; x < w; x++) {
            var sx = x / w;
            var ray = camera.generateRay(sx, sy);
            var color = rayTraceRecursive(scene, ray, maxReflect);
            pixels[i++] = color.r * 255;
            pixels[i++] = color.g * 255;
            pixels[i++] = color.b * 255;
            pixels[i++] = 255;
        }
    }
    ctx.putImageData(imgdata, 0, 0);

}

function renderDepth(canvas,scene,camera,maxDepth) {
    //test canvas and provide a basic render notion
    var ctx = canvas.getContext("2d");
    var w = canvas.width;
    var h = canvas.height;
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, w, h);
    var imgdata = ctx.getImageData(0, 0, w, h);
    var pixels = imgdata.data;
    scene.initialize();
    camera.initialize();
    var i = 0;
    for (var y = 0; y < h; y++) {
        var sy = 1 - y / h;
        for (var x = 0; x < w; x++) {
            var sx = x / w;
            var ray = camera.generateRay(sx, sy);
            var result = scene.intersect(ray);
            if (result.geometry) {
                var depth = 255 - Math.min((result.distance / maxDepth) * 255, 255);
                pixels[i] = depth;
                pixels[i + 1] = depth;
                pixels[i + 2] = depth;
                pixels[i + 3] = 255;
            }
            i += 4;
        }
    }
    ctx.putImageData(imgdata, 0, 0);
}


