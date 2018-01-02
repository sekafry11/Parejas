function Parejas(){
	var par = this;
	var cantidad_parejas = 10,
		piezas_x_pareja = 2,
		previsualizacion = false,
		dividir_imagen = 1,
		divisiones_completas = false;
		fallos = 0,
		intentos = 0, //0 -> infinito
		ancho_img = 100,
		alto_img = 100,
		ancho_tabla = 5,
		lista_cartas = [],
		carta_actual = -1,
		numero_actual = 0,
		estado = 1,
		v_fallos = document.createElement("span"),
		v_encontradas = document.createElement("div"),
		tabla = document.createElement("table");

	function Carta(n_pareja, par, img, ancho, alto){
		var parejas = par,
			carta = this,
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
				parejas.e_click(carta, n_pareja);
			}
		};
	};

	function generarImagen(n_pareja, n_pieza){
		var datos = [], d_temp, img = new Image;
		datos[0] = {w: 100, f:function(a){return "./images/div_0/"+a+".jpg";}};
		datos[1] = {w: 200, f: function(a){return "./images/div_1/"+a+".jpg";}};
		img.src = (d_temp = (datos[dividir_imagen])?datos[dividir_imagen]:datos[1]).f(n_pareja);
		var left = (divisiones_completas)?
			ancho_img*(n_pieza-Math.floor(n_pieza/dividir_imagen)*n_pieza):
			n_pieza*(d_temp.w/(dividir_imagen*2));
		img.style.left = "-"+left+"px";
		return img;
	}

	function generarCartas(){
		var n_pareja, n_pieza;
		for(n_pareja = 0; n_pareja < cantidad_parejas; ++n_pareja){
			for(n_pieza = 0; n_pieza < piezas_x_pareja; ++n_pieza){
				lista_cartas.push(
					new Carta(n_pareja, par, generarImagen(n_pareja, n_pieza), ancho_img, alto_img)
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
		v_fallos.innerHTML = fallos;
		var a, p;
		if(estado && (a = document.getElementById("status"))){
			p = document.createElement("p");
			p.innerHTML = "Fallos: ";
			p.appendChild(v_fallos);
			a.appendChild(p);
			a.appendChild(v_encontradas);
		}

		//Reset config
		if(estado && (a = document.getElementById("config"))){
			//Crear elementos
			var v_reset = document.createElement("button"),
				v_intentos = document.createElement("input"),
				v_parejas = document.createElement("input"),
				v_piezas = document.createElement("input"),
				v_dividir = document.createElement("input");
				v_d_completas = document.createElement("input");

			//Cargar valores
			v_intentos.setAttribute("type", "number");
			v_intentos.value = intentos;
			v_parejas.setAttribute("type", "number");
			v_parejas.value = cantidad_parejas;
			v_piezas.setAttribute("type", "number");
			v_piezas.value = piezas_x_pareja;
			v_dividir.setAttribute("type", "number");
			v_dividir.value = dividir_imagen;
			v_d_completas.setAttribute("type", "checkbox");
			v_d_completas.checked = divisiones_completas;
			v_reset.innerHTML = "Reset";

			//Crear eventos
			v_intentos.onchange = function(e){intentos = e.target.value || 0};
			v_parejas.onchange = function(e){cantidad_parejas = e.target.value || 0};
			v_piezas.onchange = function(e){piezas_x_pareja = e.target.value || 0};
			v_dividir.onchange = function(e){dividir_imagen = e.target.value || 0};
			v_d_completas.onchange = function(e){divisiones_completas = e.target.checked || false};
			v_reset.onclick = function(e){par.reset();return false;}

			//Mostrar config
			p = document.createElement("label");
			p.innerHTML = "Número de intentos: ";
			p.appendChild(v_intentos);
			a.appendChild(p);
			p = document.createElement("label");
			p.innerHTML = "Número de parejas: ";
			p.appendChild(v_parejas);
			a.appendChild(p);
			p = document.createElement("label");
			p.innerHTML = "Número de piezas: ";
			p.appendChild(v_piezas);
			a.appendChild(p);
			p = document.createElement("label");
			p.innerHTML = "Número de dividir: ";
			p.appendChild(v_dividir);
			a.appendChild(p);
			p = document.createElement("label");
			p.innerHTML = "Divisiones de imagenes completas: ";
			p.appendChild(v_d_completas);
			a.appendChild(p);
			p = document.createElement("p");
			p.innerHTML = "Para confirmar algunos cambios hay que resetear la tabla: ";
			p.appendChild(v_reset);
			a.appendChild(p);
		}
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
				if(++numero_actual >= piezas_x_pareja){
					//Todas las parejas encontradas
					lista_cartas = [];
					numero_actual = 0;
					carta_actual = -1;
					v_encontradas.appendChild(carta.getImagen());
				}
			}else{
				setTimeout(par.hidden, 500);
				numero_actual = 0;
				carta_actual = -1;
				v_fallos.innerHTML = ++fallos;
			}
		}
	}
	this.hidden = function(){
		var a;
		for(a in lista_cartas){
			lista_cartas[a].hidden();
		}
		lista_cartas = [];
	}
}
