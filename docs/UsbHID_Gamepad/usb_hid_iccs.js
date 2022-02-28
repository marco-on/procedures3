/*
	Programa Node js para: 
	1. Listar la descripción de los periféricos USB conectados.
	2. leer los valores USB enviados desde un Gamepad y
	   transmitirlos por UDP a un puerto y dirección IPv4.
	
	Autor: ing. Marco Ortiz
	
*/

const argv = process.argv;	//to receive arguments in argv

var PORT = Number(argv[6]); //argument for port
var HOST = argv[5];			//argument for IPv4 address

var HID = require('node-hid'); //for usb-hid
var dgram = require('dgram');  //for udp client transmission

var data_ant = Buffer.alloc(8); //8B received from gamepad

if (argv[2] === "list")		//argument to list usb hid devices
{
	var devices = HID.devices();
	console.log (devices);
}
else if (argv[2] === "open")  //open and read from usb hid
{
	var device = new HID.HID(Number(argv[3]), Number(argv[4]));
	//console.log(device);
	device.on("data", function(data) {

		if (Buffer.compare(data, data_ant) != 0) //transmit only when change in data detected
		{
//			console.log(data);
			send_udp_message(data);
		}

		let len_data = data.length;
		for (let index=0 ; index < len_data ; index++) //update buffer with previous received
			data_ant[index] = data[index];

	
	});
	//device.close();

}

function send_udp_message(data) {
	var client = dgram.createSocket('udp4');
	client.send(data, 0, data.length, PORT, HOST, function(err, bytes) {
		if (err) throw err;
	  //	console.log('UDP message sent to ' + HOST +':'+ PORT);
  		client.close();
	});

}

