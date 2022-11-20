//  강아지 얼굴을 3D로 모델링하고 Phong-lighting 모델을 적용 - dog.js
// 과목: 컴퓨터 그래픽스
// 분반: 1분반
// 학번: 32203928
// 학과: 소프트웨어학과
// 이름: 장현정

"use strict";

var gl;
// 정육면체 7개 = 사각형 42개 = 삼각형 84개 = 84*3 = 252
var numVertices = 252;
var index = 0;

var pointsArray = [];
var normalsArray = [];

var vertices = [
  //강아지 얼굴 가운데
  vec4(-0.4, -0.5, 0.45, 1.0), // 0
  vec4(-0.4, 0.5, 0.45, 1.0), // 1
  vec4(0.5, 0.5, 0.45, 1.0), // 2
  vec4(0.5, -0.5, 0.45, 1.0), // 3
  vec4(-0.4, -0.5, -0.45, 1.0), // 4
  vec4(-0.4, 0.5, -0.45, 1.0), // 5
  vec4(0.5, 0.5, -0.45, 1.0), // 6
  vec4(0.5, -0.5, -0.45, 1.0), // 7

  // 강아지 왼쪽 귀
  vec4(0.3, -0.5, 1.0, 1.0), // 8
  vec4(0.3, -0.2, 1.0, 1.0), // 9
  vec4(0.4, -0.2, 0.9, 1.0), // 10
  vec4(0.4, -0.5, 0.9, 1.0), // 11
  vec4(0.3, -0.5, 0.45, 1.0), // 12
  vec4(0.3, -0.2, 0.45, 1.0), // 13
  vec4(0.4, -0.2, 0.45, 1.0), // 14
  vec4(0.4, -0.5, 0.45, 1.0), // 15

  // 강아지 오른쪽 귀
  vec4(0.3, 0.2, 1.0, 1.0), // 16
  vec4(0.3, 0.5, 1.0, 1.0), // 17
  vec4(0.4, 0.5, 0.9, 1.0), // 18
  vec4(0.4, 0.2, 0.9, 1.0), // 19
  vec4(0.3, 0.2, 0.45, 1.0), // 20
  vec4(0.3, 0.5, 0.45, 1.0), // 21
  vec4(0.4, 0.5, 0.45, 1.0), // 22
  vec4(0.4, 0.2, 0.45, 1.0), // 23

  // 강아지 코와 입
  vec4(0.5, -0.3, 0.0, 1.0), // 24
  vec4(0.5, 0.3, 0.0, 1.0), // 25
  vec4(0.8, 0.3, 0.0, 1.0), // 26
  vec4(0.8, -0.3, 0.0, 1.0), // 27
  vec4(0.5, -0.3, -0.35, 1.0), // 28
  vec4(0.5, 0.3, -0.35, 1.0), // 29
  vec4(0.8, 0.3, -0.35, 1.0), // 30
  vec4(0.8, -0.3, -0.35, 1.0), // 31

  // 강아지 콧구멍
  vec4(0.8, -0.1, 0.0, 1.0), // 32
  vec4(0.8, 0.1, 0.0, 1.0), // 33
  vec4(0.9, 0.1, 0.0, 1.0), // 34
  vec4(0.9, -0.1, 0.0, 1.0), // 35
  vec4(0.8, -0.1, -0.1, 1.0), // 36
  vec4(0.8, 0.1, -0.1, 1.0), // 37
  vec4(0.9, 0.1, -0.1, 1.0), // 38
  vec4(0.9, -0.1, -0.1, 1.0), // 39

  // 강아지 눈
  // 강아지 왼쪽 눈
  vec4(0.5, -0.25, 0.3, 1.0), // 40
  vec4(0.5, -0.15, 0.3, 1.0), // 41
  vec4(0.5, -0.15, 0.2, 1.0), // 42
  vec4(0.5, -0.25, 0.2, 1.0), // 43
  vec4(0.6, -0.25, 0.25, 1.0), // 44
  vec4(0.6, -0.15, 0.25, 1.0), // 45
  vec4(0.6, -0.15, 0.2, 1.0), // 46
  vec4(0.6, -0.25, 0.2, 1.0), // 47
  // 강아지 오른쪽 눈
  vec4(0.5, 0.15, 0.3, 1.0), // 48
  vec4(0.5, 0.25, 0.3, 1.0), // 49
  vec4(0.5, 0.25, 0.2, 1.0), // 50
  vec4(0.5, 0.15, 0.2, 1.0), // 51
  vec4(0.6, 0.15, 0.25, 1.0), // 52
  vec4(0.6, 0.25, 0.25, 1.0), // 53
  vec4(0.6, 0.25, 0.2, 1.0), // 54
  vec4(0.6, 0.15, 0.2, 1.0), // 55
];

// light(광원)은 점 표현 - 조명의 위치, 세기에 대한 정보 설정(점, 벡터로 표현)
var lightPosition = vec4(1.0, 1.0, 1.0, 0.0);
var lightAmbient = vec4(0.0, 0.5, 0.2, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

// diffuse, ambient, specular는 rgba 값 표현
var materialAmbient = vec4(1.0, 0.0, 1.0, 1.0);
var materialDiffuse = vec4(0.8, 0.5, 0.1, 1.0); // 물체 색
var materialSpecular = vec4(1.0, 0.8, 0.0, 1.0); // 물체에 조명이 받을때 나타나는 색상
var materialShininess = 100.0; // 물체의 색이 얼마나 반짝이는지 표현

var ctm;
var ambientColor, diffuseColor, specularColor;
var modelView, projection;
var viewerPos;
var program;

var modelViewMatrix, projectionMatrix;

var normalMatrix;

// button x, y, z 회전 및 정지에 필요
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 1; // 회전 초기 값 y 축으로 설정
var theta = [0, 0, 0];
var thetaLoc;
var flag = true; // 회전 여부

// 정육면체 한 면인 사각형 그리기
function quad(a, b, c, d) {
  var t1 = subtract(vertices[b], vertices[a]);
  var t2 = subtract(vertices[c], vertices[b]);
  var normal = cross(t1, t2);
  var normal = vec3(normal);

  pointsArray.push(vertices[a]);
  normalsArray.push(normal);
  pointsArray.push(vertices[b]);
  normalsArray.push(normal);
  pointsArray.push(vertices[c]);
  normalsArray.push(normal);
  pointsArray.push(vertices[a]);
  normalsArray.push(normal);
  pointsArray.push(vertices[c]);
  normalsArray.push(normal);
  pointsArray.push(vertices[d]);
  normalsArray.push(normal);
}

// 정점을 가지고 정육면체 생성하기
function dogCube() {
  // 강아지 얼굴 가운데
  quad(1, 0, 3, 2);
  quad(2, 3, 7, 6);
  quad(3, 0, 4, 7);
  quad(6, 5, 1, 2);
  quad(4, 5, 6, 7);
  quad(5, 4, 0, 1);

  // 강아지 왼쪽 귀
  quad(9, 8, 11, 10);
  quad(10, 11, 15, 14);
  quad(11, 8, 12, 15);
  quad(14, 13, 9, 10);
  quad(12, 13, 14, 15);
  quad(13, 12, 8, 9);

  // 강아지 오른쪽 귀
  quad(17, 16, 19, 18);
  quad(18, 19, 23, 22);
  quad(19, 16, 20, 23);
  quad(22, 21, 17, 18);
  quad(20, 21, 22, 23);
  quad(21, 20, 16, 17);

  // 강아지 코와 입
  quad(25, 24, 27, 26);
  quad(26, 27, 31, 30);
  quad(27, 24, 28, 31);
  quad(30, 29, 25, 26);
  quad(28, 29, 30, 31);
  quad(29, 28, 24, 25);

  // 강아지 콧구멍
  quad(34, 35, 39, 38);
  quad(33, 32, 35, 34);
  quad(35, 32, 36, 39);
  quad(38, 37, 33, 34);
  quad(36, 37, 38, 39);
  quad(37, 36, 32, 33);

  // 강아지 눈
  // 왼쪽 눈
  quad(41, 40, 44, 45);
  quad(45, 44, 47, 46);
  quad(42, 43, 47, 46);
  quad(41, 40, 42, 43);
  quad(40, 43, 47, 44);
  quad(41, 42, 46, 45);
  // 오른쪽 눈
  quad(49, 48, 52, 53);
  quad(53, 52, 55, 54);
  quad(50, 51, 55, 54);
  quad(49, 48, 51, 50);
  quad(51, 48, 52, 55);
  quad(50, 49, 53, 54);
}

window.onload = function init() {
  const canvas = document.getElementById("canvas");

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  gl.enable(gl.DEPTH_TEST);

  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  dogCube();

  const nBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);

  const vNormal = gl.getAttribLocation(program, "vNormal");
  gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vNormal);

  const vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

  const vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  thetaLoc = gl.getUniformLocation(program, "theta");

  viewerPos = vec3(0.0, 0.0, 20.0);

  projection = ortho(-1, 1, -1, 1, -100, 100);

  var ambientProduct = mult(lightAmbient, materialAmbient);
  var diffuseProduct = mult(lightDiffuse, materialDiffuse);
  var specularProduct = mult(lightSpecular, materialSpecular);

  // 버튼 동작 수행
  document.getElementById("X").onclick = function () {
    axis = xAxis;
  };
  document.getElementById("Y").onclick = function () {
    axis = yAxis;
  };
  document.getElementById("Z").onclick = function () {
    axis = zAxis;
  };
  document.getElementById("T").onclick = function () {
    flag = !flag;
  };

  // background light
  gl.uniform4fv(
    gl.getUniformLocation(program, "ambientProduct"),
    flatten(ambientProduct)
  );
  // 물체의 색과 패턴, 물체 형상 등 정의
  gl.uniform4fv(
    gl.getUniformLocation(program, "diffuseProduct"),
    flatten(diffuseProduct)
  );
  // 조명 표현
  gl.uniform4fv(
    gl.getUniformLocation(program, "specularProduct"),
    flatten(specularProduct)
  );
  // 물체 입체감 있어 보이게 밝기 조절
  gl.uniform4fv(
    gl.getUniformLocation(program, "lightPosition"),
    flatten(lightPosition)
  );

  gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);

  // 물체 볼 수 있게
  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, "projectionMatrix"),
    false,
    flatten(projection)
  );

  render();
};

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // flag=true일때 회전 속도
  if (flag) {
    theta[axis] += 0.8;
  }

  modelView = mat4();
  modelView = mult(modelView, rotate(theta[xAxis], [1, 0, 0]));
  modelView = mult(modelView, rotate(theta[yAxis], [0, 1, 0]));
  modelView = mult(modelView, rotate(theta[zAxis], [0, 0, 1]));

  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, "modelViewMatrix"),
    false,
    flatten(modelView)
  );

  gl.drawArrays(gl.TRIANGLES, 0, numVertices);

  requestAnimFrame(render);
}
