// VARIABLES DECLARATION ///////////////////////////////

var shape = {
    Pen: new Path(),
    Brush: new Path(),
    Line: new Path(),
    Triangle: new Path(),
    Circle: new Path(),
    Rectangle: new Path()
};

var line = {
    pointX: new Point(0, 0),
    pointY: new Point(0, 0)
};

var isDrawn = {
    rectangle: false,
    pen: false,
    brush: false
};

var pathOf = {
    pen: {},
    brush: {}
};

var emitted = {
    Pen: new Path(),
    Brush: new Path(),
    Line: new Path(),
    Triangle: new Path(),
    Circle: new Path(),
    Rectangle: new Path()
};

var current = {
    color: 'black',
    tool: 'pen',
    cursor: 'default'
};

var myCursor = document.querySelector('#draw');
var colors = document.querySelectorAll('div.color-pallet');
var tools = document.querySelectorAll('div.tool-pallet img');
// var clear = document.querySelectorAll('div.clear');
// var undo = document.querySelectorAll('div.undo');
// var select = document.querySelectorAll('div.select');
tool.minDistance = 10;
tool.maxDistance = 45;


myCursor.addEventListener("mouseover", function (event) {
    myCursor.style.cursor = current.cursor;
    console.log('mousess');
    console.log('current cursor :', current.cursor);
})


// MISCELLANEOUS FUNCTIONS /////////////////////////////////////////

var uid = (function () {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}());

function randomColor() {
    return {
        red: 0,
        green: Math.random(),
        blue: Math.random(),
        alpha: (Math.random() * 0.25) + 0.05
    };
}

colors.forEach(function (element) {
    element.style.backgroundColor = element.className.split(' ')[0];
    element.addEventListener('click', function (event) {
        if (event.type === 'click') {
            current.color = event.target.className.split(' ')[0];
            console.log(current.color);
        }
    });
});

tools.forEach(function (element) {
    element.addEventListener('click', function (event) {
        if (event.type === 'click') {
            current.tool = event.target.className.split(' ')[0];
            console.log(current.tool);
            console.log('event target', event.target.className.split(' ')[0]);
            switch (event.target.className.split(' ')[0]) {
                case 'line':
                case 'rectangle':
                case 'triangle':
                case 'circle':
                case 'pen':
                case 'brush':
                    current.cursor = 'crosshair';
                    break;
                case 'default': 
                    break;

            }
        }
        if (current.tool === 'select') {
            console.log('Select clicked');
            current.cursor = 'move';
            project.activeLayer.lastChild.selected = true;
        }
        if (current.tool === 'clear') {
            console.log('clear clicked');
            current.cursor = 'default';
            project.activeLayer.removeChildren();
            view.draw();
        }
        if (current.tool === 'undo') {
            console.log('undo clicked');
            current.cursor = 'default';
            project.activeLayer.lastChild.remove();
            view.draw();
        }
        if (current.tool === 'hand') {
            console.log('hand clicked');
            current.cursor = 'nwse-resize';
            view.draw();
        }
    });

});



// clear[0].addEventListener('click', function (event) {
// });

// undo[0].addEventListener('click', function (event) {
// });

// select[0].addEventListener('click', function (event) {
//     if (event.type === 'click') {
//         console.log('select clicked');
//         project.activeLayer.lastChild.selected = true;
//         view.draw();
//     }
// });





// SYSTEM MOUSE EVENTS //////////////////////////////////////////////

function onMouseDown(event) {
    view.draw();
    switch (current.tool) {
        case 'line':
            mouseDownDrawLine(event);
            break;
        case 'rectangle':
            mouseDownDrawRectangle(event);
            break;
        case 'triangle':
            console.log('triangle mouse down event occured');
            break;
        case 'circle':
            console.log('circle mouse down event occured');
            break;
        case 'pen':
            mouseDownDrawPen(event);
            break;
        case 'brush':
            shape.Brush = new Path();
            mouseDownDrawBrush(event);
            break;
        default:
            console.log('unknown mouse down switch statement');
            break;
    }
}

function onMouseDrag(event) {
    if (isDrawn.pen) {
        mouseDragDrawPen(event);
    }
    if (isDrawn.brush) {
        mouseDragDrawBrush(event);
    }
    if (current.tool === 'select') {
        console.log('dragging select tooll');
        paper.project.activeLayer.lastChild.position = event.point;
    }
    if (current.tool === 'hand') {
        console.log('dragging hand tooll');
    }
}



function onMouseUp(event) {
    var rectangleSize, rectPath;

    switch (current.tool) {

        case 'line':
            mouseUpDrawLine(event);
            break;

        case 'rectangle':
            mouseUpDrawRectangle(event);
            break;
        case 'triangle':
            mouseUpDrawtriangle(event);
            break;
        case 'circle':
            mouseUpDrawCircle(event);
            break;
        case 'pen':
            mouseUpDrawPen(event);
            break;
        case 'brush':
            isDrawn.brush = false;
            MouseUpDrawBrush(event);
            break;
        case 'hand':
            mouseUpDrawHand(event);
            break;
        default:
            console.log('unknown  mouseup switch statement');
            break;
    }
    if (isDrawn.rectangle) {
        rectangle.onMouseEnter = function (event) {
            // this.fillColor = 'cyan';
        }
        rectangle.onMouseLeave = function (event) {
            // this.fillColor = current.color;
        }
        rectangle.onMouseDrag = function (event) {
            // rectangle.position += event.delta;
        }
    }

}




// CUSTOM MOUSE EVENTS FUNCTIONS //////////////////////////////////////////// 



// MOUSE DOWN EVENTS/////////////

function mouseDownDrawBrush(event) {
    console.log('start of brush ', shape.Brush);
    shape.Brush.fillColor = current.color;
    shape.Brush.add(event.point);
    console.log('brush path mouse pressed positions' + shape.Brush.position);
    isDrawn.brush = true;
    pathOf.brush = {
        start: {
            "x": event.point.x,
            "y": event.point.y
        },
        events: [],
        end: {},
        color: current.color
    };
}

function mouseDownDrawLine(event) {
    shape.Line = new Path();
    shape.Line.strokeColor = current.color;
    shape.Line.strokeWidth = 5;
    line.pointX = event.point;
    console.log('point x is ' + line.pointX + "event.point is " + event.point);
    shape.Line.add(event.point);
}

function mouseDownDrawRectangle(event) {
    shape.Rectangle = new Point(event.point);
    console.log('event.point ' + event.point);
    console.log('initial rect point ' + shape.Rectangle);
}

function mouseDownDrawPen(event) {
    shape.Pen = new Path();
    shape.Pen.strokeColor = current.color;
    shape.Pen.add(event.point);
    isDrawn.pen = true;
    pathOf.pen = {
        start: {
            "x": event.point.x,
            "y": event.point.y
        },
        path: [],
        color: current.color
    };
}



// MOUSE DRAG EVENTS ///////////////////

function mouseDragDrawPen(event) {
    console.log('event.point mousedrag ', event.point.x, event.point.y);
    shape.Pen.add(event.point);
    pathOf.pen.path.push({
        x: event.point.x,
        y: event.point.y
    });
}

function mouseDragDrawBrush(event) {
    var step = event.delta / 2;
    step.angle += 90;
    var top = event.middlePoint + step;
    var bottom = event.middlePoint - step;

    shape.Brush.add(top);
    shape.Brush.insert(0, bottom);
    shape.Brush.smooth();
    pathOf.brush.events.push({
        "top": top,
        "bottom": bottom,
    });

}


// MOUSE UP EVENTS ////////////////////


function mouseUpDrawLine(event) {
    line.pointY = event.point;
    console.log("point y is " + line.pointY + "event.point is " + event.point);
    shape.Line.add(event.point);
    view.draw();
    emitLine(line.pointX, line.pointY, current.color);
}

function mouseUpDrawRectangle(event) {
    console.log('shape.rectangle is : ', shape.Rectangle);
    rectangleSize = event.delta + shape.Rectangle;
    console.log('rectangleSize is : ', rectangleSize);
    console.log('event.delta', event.delta);
    rectPath = new Rectangle(shape.Rectangle, rectangleSize);
    rectangle = new Path.Rectangle(rectPath);
    rectangle.fillColor = current.color;
    rectangle.selected = false;
    isDrawn.rectangle = true;
    emitRect(shape.Rectangle, rectangleSize, current.color);
    console.log('rectangle layer' + rectangle.layer);
}

function mouseUpDrawtriangle(event) {
    shape.Triangle = new Path.RegularPolygon(event.downPoint, 3, event.delta.length);
    shape.Triangle.fillColor = current.color;
    shape.Triangle.selected = false;
    emitTri(event.downPoint, 3, event.delta.length, current.color);
}

function mouseUpDrawCircle(event) {
    shape.Circle = new Path.Circle({
        center: event.downPoint,
        radius: event.delta.length
    });
    shape.Circle.strokeColor = 'black';
    shape.Circle.fillColor = current.color;
    shape.Circle.selected = false;
    emitCir(event.downPoint, event.delta.length, current.color);
}

function mouseUpDrawHand(event) {
    var finalSize = 1;
    if (((event.delta.x + event.delta.y) / 50) < 1) {
        finalSize = finalSize + (((event.delta.x + event.delta.y) * 100) % .75);
    } else if (((event.delta.x + event.delta.y) / 50) >= 1) {
        finalSize = finalSize - (((event.delta.x + event.delta.y) * 100) % .75);
    }
    console.log('delta', ((event.delta.x + event.delta.y) * 100) % .75);
    console.log('final size ', finalSize);
    paper.project.activeLayer.lastChild.scale(finalSize);
}


function mouseUpDrawPen(event) {
    isDrawn.pen = false;
    shape.Pen.add(event.point);
    shape.Pen.closed = false;
    shape.Pen.smooth();
    console.log('whole pen path ', shape.Pen);
    pathOf.pen.end = {
        "x": event.point.x,
        "y": event.point.y
    };
    io.emit('drawPens', JSON.stringify(pathOf.pen));
    pathOf.pen.path = new Array();
}


function MouseUpDrawBrush(event) {
    isDrawn.brush = false;
    shape.Brush.add(event.point);
    // shape.Brush.closed = true;
    shape.Brush.smooth();
    pathOf.brush.end = {
        "x": event.point.x,
        "y": event.point.y
    };
    io.emit('drawBrushs', JSON.stringify(pathOf.brush));
    pathOf.brush.events = new Array();
    Object.getOwnPropertyNames(pathOf.brush.start).forEach(function (prop) {
        delete pathOf.brush.start[prop];
    });
    Object.getOwnPropertyNames(pathOf.brush.end).forEach(function (prop) {
        delete pathOf.brush.end[prop];
    });

}






// EVENT EMITTING FUNCTIONS /////////////////////////////////////////

function emitLine(x, y, color) {
    var data = {
        x: x,
        y: y,
        color: color
    };
    io.emit('drawLine', data);
}

function emitRect(points, size, color) {
    var data = {
        x: points.x,
        y: points.y,
        width: size.x,
        height: size.y,
        color: color
    };
    io.emit('drawRect', data);
}

function emitCir(points, size, color) {
    var data = {
        "middlePoint": points,
        "size": size,
        color: color
    };
    io.emit('drawCir', data);
}

function emitTri(points, corners, size, color) {
    var data = {
        middlePoint: points,
        corners: corners,
        size: size,
        color: color
    }
    io.emit('drawTri', data);
}

function emitBrush(path) {
    io.emit('drawBrush', path);
}

function emitPen(path) {
    console.log('emit pen ' + path);
    io.emit('drawPen', path);
}








// RECIEVING THE EVENTS AND THEN DISPLAYING THEM.////////////////////////////////////

io.on('drawLine', function (data) {
    emitted.Line = new Path();
    emitted.Line.strokeColor = data.color;
    emitted.Line.strokeWidth = 5;
    emitted.Line.add(new Point(data.x[1], data.x[2]));
    emitted.Line.add(new Point(data.y[1], data.y[2]));
    view.draw();
})

io.on('drawRect', function (data) {
    var myRectangle = new Rectangle(new Point(data.x, data.y), new Point(data.width, data.height));
    emitted.Rectangle = new Path.Rectangle(myRectangle);
    emitted.Rectangle.fillColor = data.color;
    emitted.Rectangle.selected = true;
    view.draw();
})

io.on('drawCir', function (data) {
    emitted.Circle = new Path.Circle(new Point(data.middlePoint[1], data.middlePoint[2]), data.size);
    emitted.Circle.fillColor = data.color;
    view.draw();
})

io.on('drawTri', function (data) {
    emitted.Triangle = new Path.RegularPolygon(new Point(data.middlePoint[1], data.middlePoint[2]), data.corners, data.size);
    emitted.Triangle.fillColor = data.color;
    emitted.Triangle.selected = false;
    console.log('emitted triangle  : ', emitted.Triangle);
    view.draw();
})


io.on('drawBrushs', function (paths) {
    var brushSegments = JSON.parse(paths);
    console.log(brushSegments);
    emitted.Brush = new Path();
    emitted.Brush.fillColor = brushSegments.color;
    emitted.Brush.add(new Point(brushSegments.start.x, brushSegments.start.y));
    var brushDragPaths = brushSegments.events.forEach(function (element) {
        var segment_arr_top = element.top.slice(1);
        var segment_arr_bottom = element.bottom.slice(1);
        emitted.Brush.add(new Point(segment_arr_top[0], segment_arr_top[1]));
        emitted.Brush.insert(0, new Point(segment_arr_bottom[0], segment_arr_bottom[1]));
        emitted.Brush.smooth();
    });
    emitted.Brush.add(new Point(brushSegments.end.x, brushSegments.end.y));
    emitted.Brush.closed = true;
    emitted.Brush.smooth();
    view.draw();
    console.log('drawbrushs ', paths);
})


io.on('drawPens', function (paths) {
    var paths = JSON.parse(paths);
    emitted.Pen = new Path();
    emitted.Pen.add(new Point(paths.start.x, paths.start.y));
    emitted.Pen.strokeColor = paths.color;
    console.log('paths', paths);
    var myresuolt = paths.path.forEach(function (item) {
        emitted.Pen.add(new Point(item.x, item.y));
    });
    console.log(myresuolt);
    emitted.Pen.add(new Point(paths.end.x, paths.end.y));
    console.log('emitted.Pen ', emitted.Pen);
    view.draw();
})