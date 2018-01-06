new function (){
	//Config
	var ts = this,
		parejas = 10,
		intentos = 0, //0 -> infinito
		piezas = 2,
		divisiones = 1,
		completas = false,
		multi = false,

		dir_ajax = "https://sekafry.000webhostapp.com/parejas/", // Directorio ajax
		previsualizacion = false,
		fallos = 0,
		ancho_img = 100,
		alto_img = 100,
		ancho_tabla = 5,
		lista_cartas = [],
		carta_actual = -1,
		numero_actual = 0,
		estado = 1;
		var a;

		var tabla = newNode("table", (a = document.getElementById("game"))?a:null),

	//Visual Config
		l_parejas = newNode("label", (a = (a = document.getElementById("config"))?a:null), {"innerHTML": "Parejas: "}),
		i_parejas = newNode("input", l_parejas, {"type": "number", "value":parejas, "onchange": function(e){parejas = e.target.value || 0}}),

		l_intentos = newNode("label", a, {"innerHTML": "Intentos: "}),
		i_intentos = newNode("input", l_intentos, {"type": "number", "value":intentos, "onchange": function(e){intentos = e.target.value || 0}}),

		l_piezas = newNode("label", a, {"innerHTML": "Piezas por pareja: "}),
		i_piezas = newNode("input", l_piezas, {"type": "number", "value":piezas, "onchange": function(e){piezas = e.target.value || 0}}),

		l_divisiones = newNode("label", a, {"innerHTML": "Divisiones en la imagen: "}),
		i_divisiones = newNode("input", l_divisiones, {"type": "number", "value":divisiones, "onchange": function(e){divisiones = e.target.value || 0}}),

		l_completas = newNode("label", a, {"innerHTML": "Divisiones completas: "}),
		i_completas = newNode("input", l_completas, {"type": "checkbox", "checked": completas, "onchange": function(e){completas = e.target.checked || false}}),

		b_reset = newNode("button", a, {"innerHTML": "Cargar", "onclick": function(e){ts.reset();return false;}}),

	//Visual Status
		p_fallos = newNode("p", (a = (a = document.getElementById("status"))?a:null), {"innerHTML": "Fallos: "}),
		s_fallos = newNode("span", p_fallos),

		d_encontradas = newNode("div", a),

	//Visual multiplayer
		l_multi = newNode("label", (a = (a = document.getElementById("multiplayer"))?a:null), {"innerHTML": "Multijugador: "}),
		i_multi = newNode("input", l_multi, {"type": "checkbox", "checked": multi, "onchange": function(e){multi = e.target.checked || false; changeMulti();}}),
		d_multi = newNode("div", a, {"innerHTML": "No conectado"});

	function Carta(n_pareja, par, img, ancho, alto){
		var tsp = par, // parejas
			ts = this, // carta
			n_pareja = n_pareja,
			img = img,
			ancho = ancho,
			alto = alto,
			td = document.createElement("td");
			td.style.width = ancho+"px";
			td.style.height = alto+"px";
			td.appendChild(img);
		this.getTd = function(){
			return td;
		};
		this.hidden = function(){
			img.removeAttribute("class");
		};
		this.getImagen = function(){
			var r = new Image();
			r.src = img.src;
			return r;
		};
		td.onclick = function(){
			if(!img.getAttribute("class")){
				img.setAttribute("class", "visible");
				tsp.e_click(ts, n_pareja);
			}
		};
	};

	function generarImagen(n_pareja, n_pieza){
		var datos = [], d_temp, img = new Image;
		datos[0] = {w: 100, f:function(a){return "./images/div_0/"+a+".jpg";}};
		datos[1] = {w: 200, f: function(a){return "./images/div_1/"+a+".jpg";}};
		img.src = (d_temp = (datos[divisiones])?datos[divisiones]:datos[1]).f(n_pareja);
		var left = (completas)?
			ancho_img*(n_pieza-Math.floor(n_pieza/divisiones)*n_pieza):
			n_pieza*(d_temp.w/(divisiones*2));
		img.style.left = "-"+left+"px";
		return img;
	}

	function generarCartas(){
		var n_pareja, n_pieza;
		for(n_pareja = 0; n_pareja < parejas; ++n_pareja){
			for(n_pieza = 0; n_pieza < piezas; ++n_pieza){
				lista_cartas.push(
					new Carta(n_pareja, ts, generarImagen(n_pareja, n_pieza), ancho_img, alto_img)
				);
			}
		}

		var n_columnas = 0, carta_temp, index_temp, tr_temp = document.createElement("tr");
		tabla.appendChild(tr_temp);

		while(lista_cartas.length > 0){
			index_temp = Math.floor(Math.random()*lista_cartas.length);
			if(++n_columnas > ancho_tabla){
				n_columnas = 1;
				tr_temp = document.createElement("tr");
				tabla.appendChild(tr_temp);
			}
			tr_temp.appendChild(lista_cartas[index_temp].getTd());
			lista_cartas.splice(index_temp, 1);
		}
	}
	this.reset = function(){
		//Reset Tabla
		tabla.innerHTML = "";
		generarCartas();
		//Reset Status
		fallos = 0;
		s_fallos.innerHTML = fallos;
		d_encontradas.innerHTML = "";
		estado = 0;
		return tabla;
	};
	this.e_click = function(carta, numero){
		lista_cartas.push(carta);
		if(carta_actual < 0){
			carta_actual = numero;
			++numero_actual;
		}else{
			if(carta_actual == numero){
				if(++numero_actual >= piezas){
					//Todas las parejas encontradas
					lista_cartas = [];
					numero_actual = 0;
					carta_actual = -1;
					d_encontradas.appendChild(carta.getImagen());
				}
			}else{
				for(var a in lista_cartas){
					setTimeout(lista_cartas[a].hidden, 500);
				}
				lista_cartas = [];
				numero_actual = 0;
				carta_actual = -1;
				s_fallos.innerHTML = ++fallos;
			}
		}
	}
	function changeMulti(){
		if(multi){
			ajax(dir_ajax+"login.php?conect=true", function(e){d_multi.innerHTML = e});
		}else{
			ajax(dir_ajax+"login.php?conect=false", function(e){d_multi.innerHTML = e});
		}
	}


	generarCartas();
}
