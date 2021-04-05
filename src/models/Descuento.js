import mongoose from '../utils/db_connection'
const Schema = mongoose.Schema;

const Descuento = new Schema({
	//Fecha de creacion del Descuento \ Obj Date
	createdAt: {
		type: Date,
		required: true,
	},
	//Codigo del descuento \String, unique
	codigo: {
		type: String,
		required: true,
		unique: true
	},
	//Descripcion del descuento \String
	descripcion: {
		type: String,
		required: true
	},
	//Tipo del descuento \String, [fixed, percentage, buyAndSomeFree,buySomeFixedPrice]
	tipo: {
		type: String,
		required: true,
		enum: [
			'fixed', 'percentage',
			'buyAndSomeFree', 'buySomeFixedPrice'
		]
	},
	/*
	Monto del descuento.
	Solo aplica si el tipo de descuento es de tipo fixed O percentage
	Si es de tipo percentage, el valor debe de estar entre 1 y 100
	este valor representa el porcentaje o monto del descuento\ Number
	*/
	monto: Number,
	/*
	Toma los dos valores de los descuentos.
	Aplica : buyAndSomeFree, buySomeFixedPrice. 
	Si buyAndSomeFree:
		cantidad_llevar : Numero de productos que el cliente recibe
		cantidad_pagar : Numero de productos que el cliente debe pagar
	Si buySomeFixedPrice:
		cantidad_llevar : Numero de productos que el cliente recibe
		cantidad_pagar : Monto a pagar para recibir los productos
	*/
	cantidad_llevar: Number,
	cantidad_pagar: Number,
	//Expiración del descuento \String(por el momento
	fecha_expiracion: {
		type: String,
		required: true
	},
	//Definir cantidad de cupones restantes \Number
	cupones_restantes: {
		type: Number,
		required: true
	},//Pedidos en los que este cupon se aplico, esto funciona automáticamente
	pedidos: [
		{
			type: Schema.Types.ObjectId,
			ref: "Pedido",
		},
	],
	//Status del descuento, funciona automáticamente
	activo: {
		type: Boolean,
		required: true,
		default: true
	},
	//Define el autor del descuento, funciona automáticamente
	generado_por: {
		type: String,
		required: true,
		enum: ['venta', 'manual']
	},
	//Marca a la que pertenece el descuento, funciona automáticamente
	marca: {
		type: String,
		required: true
	},
	//Solo aplica a descuentos de cantidad,
	//sirve para definir el precio de cada cuadro extra a la promoción aplicada
	precio_cuadro_extra: {
		type: Number
	}
})

// Schema.pre('Descuento', async () =>{
// 	//Verificar que el descuento este entre 1 y 100
// })
module.exports = mongoose.model('Descuento', Descuento)