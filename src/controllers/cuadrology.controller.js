import moment from "moment";
import Descuento from "../models/Descuento";
import Cliente from "../models/Cliente";
import Pedido from "../models/Pedido";

let controller = {};
let date = new Date();
const {
  precio_unitario,
  cantidad_minima_cuadros,
  precio_cantidad_minima_cuadros,
} = process.env;

controller.create_cupon = async (req, res) => {
  const {
    codigo,
    descripcion,
    tipo,
    monto,
    cantidad_llevar,
    cantidad_pagar,
    fecha_expiracion,
    cupones_restantes,
    generado_por,
    precio_cuadro_extra,
  } = req.body;

  const percentageDiscount = async () => {
    const createdAt = new Date();
    const marca = "Cuadrology";
    const cupon = new Descuento({
      createdAt,
      codigo,
      descripcion,
      tipo,
      monto,
      fecha_expiracion,
      cupones_restantes,
      generado_por,
      marca,
      precio_cuadro_extra,
    });
    await cupon.save((err, cupon) => {
      if (err) {
        res.status(500).json({
          error: err.message,
        });
      } else {
        res.status(200).json({
          data: cupon,
        });
      }
    });
  };
  const twoItemsDiscount = async () => {
    const createdAt = new Date();
    const marca = "Cuadrology";
    const cupon = new Descuento({
      createdAt,
      codigo,
      descripcion,
      tipo,
      cantidad_llevar,
      cantidad_pagar,
      fecha_expiracion,
      cupones_restantes,
      generado_por,
      marca,
      precio_cuadro_extra,
    });
    await cupon.save((err, cupon) => {
      if (err) {
        res.status(500).json({
          error: err.message,
        });
      } else {
        res.status(200).json({
          data: cupon,
        });
      }
    });
  };
  switch (tipo) {
    case "fixed":
      //Descuento de monto en dinero al total
      percentageDiscount();
      break;

    case "percentage":
      //Descuento de porcentaje al total
      percentageDiscount();
      break;

    case "buyAndSomeFree":
      twoItemsDiscount();
      //Compra una cantidad y te llevas mas
      break;

    case "buySomeFixedPrice":
      twoItemsDiscount();
      //Compra una cantidad por x precio
      break;
    default:
      break;
  }
};
controller.comprobar_cupon = async (req, res) => {
  const cupon = req.params.cupon;
  await Descuento.findOne({ codigo: cupon }, (err, cupon) => {
    if (err) {
      res.json({
        code: 500,
        error: {
          message: "Ocurrio un error al comprobar el cupon",
        },
      });
    }
    if (cupon) {
      /* Nota importante: Con momentjs es necesario calcular
				 si la fecha de expiración ya ocurrió, en ese momento 
				 actualizar el estado de del cupon a inactivo 
			*/

      cupon.activo
        ? res.status(200).json(cupon)
        : res.status(404).json({ error: "El cupon ya expiro" });
    } else {
      res.status(404).json({ error: "Cupon no encontrado" });
    }
  });
};
controller.delete_cupon = async (req, res) => {
  const cupon = req.params.cupon;
  await Descuento.findOneAndRemove({ codigo: cupon }, (err) => {
    if (err) res.status(404).json({ error: "Cupon no existente" });
    res.status(200).json({ ok: true });
  });
};
controller.update_cupon = async (req, res) => {
  const cupon = await Descuento.findById(req.params.cupon_id, (err, cupon) => {
    err
      ? res.json({
          code: 400,
          error: { message: "Ocurrió un error", data: err },
        })
      : cupon;
  });
  const {
    descripcion,
    tipo,
    monto,
    cantidad_llevar,
    cantidad_pagar,
    fecha_expiracion,
    cupones_restantes,
    activo,
    precio_cuadro_extra,
  } = req.body;
  cupon.descripcion = descripcion || cupon.descripcion;
  cupon.tipo = tipo || cupon.tipo;
  cupon.monto = monto || cupon.monto;
  cupon.cantidad_llevar = cantidad_llevar || cupon.cantidad_llevar;
  cupon.cantidad_pagar = cantidad_pagar || cupon.cantidad_pagar;
  cupon.fecha_expiracion = fecha_expiracion || cupon.fecha_expiracion;
  cupon.cupones_restantes = cupones_restantes || cupon.cupones_restantes;
  cupon.activo = activo || cupon.activo;
  cupon.precio_cuadro_extra = precio_cuadro_extra || cupon.precio_cuadro_extra;
  await cupon.save((err, cupon) => {
    err
      ? res.json({
          code: 500,
          error: { message: "Ocurrió un error al guardar el cupon", data: err },
        })
      : res.json({
          code: 200,
          response: cupon,
        });
  });
};
controller.aplicar_cupon = async (req, res) => {
  const { cupon } = req.body;
  if (!req.body.cantidad_productos || !req.body.total) {
    res.status(400);
  }
  const fixedDiscount = (cupon) => {
    // cantidad_productos, total
    let { cantidad_productos, total } = req.body;
    let { monto, precio_cuadro_extra } = cupon;
    const cantidad_productos_adicionales = parseInt(
      cantidad_productos - cantidad_minima_cuadros
    );
    if (cantidad_productos == cantidad_minima_cuadros) {
      total == precio_cantidad_minima_cuadros - monto //Comprueba que el total sea correcto
        ? res.json({
            code: 200,
            response: {
              total: precio_cantidad_minima_cuadros - monto,
            },
          })
        : res.json({
            code: 400,
            error: {
              message: "Datos manipulados",
            },
          });
    } else if (
      parseInt(cantidad_productos) > parseInt(cantidad_minima_cuadros)
    ) {
      if (precio_cuadro_extra) {
        let precio_estimado =
          precio_cantidad_minima_cuadros -
          monto +
          cantidad_productos_adicionales * precio_cuadro_extra;
        precio_estimado == total
          ? res.json({
              code: 200,
              response: {
                total: precio_estimado,
              },
            })
          : res.json({
              code: 400,
              error: {
                message: "Datos manipulados",
              },
            });
      } else {
        let precio_estimado =
          precio_cantidad_minima_cuadros -
          monto +
          cantidad_productos_adicionales * precio_unitario;
        precio_estimado == total
          ? res.json({
              code: 200,
              response: {
                total: precio_estimado,
              },
            })
          : res.json({
              code: 400,
              error: {
                message: "Datos manipulados",
              },
            });
      }
    }
  };
  const percentageDiscount = (cupon) => {
    //cantidad_productos, total
    let { cantidad_productos, total } = req.body;
    let { monto, precio_cuadro_extra } = cupon;
    const cantidad_productos_adicionales = parseInt(
      cantidad_productos - cantidad_minima_cuadros
    );
    if (cantidad_productos == cantidad_minima_cuadros) {
      const total_esperado =
        precio_cantidad_minima_cuadros -
        (precio_cantidad_minima_cuadros * monto) / 100;
      total == total_esperado //Comprueba que el total sea correcto
        ? res.json({
            code: 200,
            response: {
              total: total_esperado,
            },
          })
        : res.json({
            code: 400,
            error: {
              message: "Datos manipulados",
            },
          });
    } else if (cantidad_productos > cantidad_minima_cuadros) {
      if (precio_cuadro_extra) {
        let total_estimado =
          precio_cantidad_minima_cuadros -
          (precio_cantidad_minima_cuadros * monto) / 100 +
          cantidad_productos_adicionales * precio_cuadro_extra;
        total_estimado == total
          ? res.json({
              code: 200,
              response: {
                total: total_estimado,
              },
            })
          : res.json({
              code: 400,
              error: {
                message: "Datos manipulados",
              },
            });
      } else {
        let total_estimado =
          precio_cantidad_minima_cuadros -
          (precio_cantidad_minima_cuadros * monto) / 100 +
          cantidad_productos_adicionales * precio_unitario;
        total_estimado == total
          ? res.json({
              code: 200,
              response: {
                total: total_estimado,
              },
            })
          : res.json({
              code: 400,
              error: {
                message: "Datos manipulados",
              },
            });
      }
    }
  };
  const buyAndSomeFreeDiscount = (cupon) => {
    //cantidad_productos, total
    let { cantidad_productos, total } = req.body;
    let { cantidad_llevar, cantidad_pagar, precio_cuadro_extra } = cupon;
    const cantidad_productos_adicionales = parseInt(
      cantidad_productos - cantidad_llevar
    );
    const cantidad_productos_adiciones_promo = parseInt(
      cantidad_pagar - cantidad_minima_cuadros
    );
    if (cantidad_productos == cantidad_llevar) {
      const total_esperado =
        parseInt(precio_cantidad_minima_cuadros) +
        parseInt(precio_unitario * cantidad_productos_adiciones_promo);
      total_esperado == total
        ? res.json({
            code: 200,
            response: {
              total: total_esperado,
            },
          })
        : res.json({
            code: 400,
            error: {
              message: "Datos manipulados",
            },
          });
    } else if (cantidad_productos > cantidad_llevar) {
      if (precio_cuadro_extra) {
        const total_esperado =
          parseInt(precio_cantidad_minima_cuadros) +
          parseInt(
            precio_cuadro_extra *
              (cantidad_productos_adicionales +
                cantidad_productos_adiciones_promo)
          );
        // const total_esperado = (parseInt(precio_cantidad_minima_cuadros) + parseInt(precio_cuadro_extra * cantidad_productos_adicionales));
        total_esperado == total
          ? res.json({
              code: 200,
              response: {
                total: total_esperado,
              },
            })
          : res.json({
              code: 400,
              error: {
                message: "Datos manipulados",
              },
            });
      } else {
        const total_esperado =
          parseInt(precio_cantidad_minima_cuadros) +
          parseInt(
            precio_unitario *
              (cantidad_productos_adicionales +
                cantidad_productos_adiciones_promo)
          );
        total_esperado == total
          ? res.json({
              code: 200,
              response: {
                total: total_esperado,
              },
            })
          : res.json({
              code: 400,
              error: {
                message: "Datos manipulados",
              },
            });
      }
    }
  };
  const buySomeFixedPriceDiscount = (cupon) => {
    let { cantidad_productos, total } = req.body;
    let { cantidad_llevar, cantidad_pagar, precio_cuadro_extra } = cupon;
    const cantidad_productos_adicionales = parseInt(
      cantidad_productos - cantidad_llevar
    );
    //const cantidad_productos_adiciones_promo = parseInt(cantidad_pagar - cantidad_minima_cuadros)
    if (cantidad_productos == cantidad_llevar) {
      const total_esperado = parseInt(cantidad_pagar);
      total_esperado == total
        ? res.json({
            code: 200,
            response: {
              total: total_esperado,
            },
          })
        : res.json({
            code: 400,
            error: {
              message: "Datos manipulados",
            },
          });
    } else if (cantidad_productos > cantidad_llevar) {
      if (precio_cuadro_extra) {
        const total_esperado =
          parseInt(cantidad_productos_adicionales) *
            parseInt(precio_cuadro_extra) +
          parseInt(cantidad_pagar);
        total_esperado == total
          ? res.json({
              code: 200,
              response: {
                total: total_esperado,
              },
            })
          : res.json({
              code: 400,
              error: {
                message: "Datos manipulados",
              },
            });
      } else {
        const total_esperado =
          parseInt(cantidad_productos_adicionales) * parseInt(precio_unitario) +
          parseInt(cantidad_pagar);
        total_esperado == total
          ? res.json({
              code: 200,
              response: {
                total: total_esperado,
              },
            })
          : res.json({
              code: 400,
              error: {
                message: "Datos manipulados",
              },
            });
      }
    }
  };
  await Descuento.findOne({ codigo: cupon }, (err, cupon) => {
    if (err) {
      res.json({
        code: 500,
        error: {
          message: "Ocurrió un error al comprobar el cupon",
        },
      });
    }
    if (cupon) {
      if (cupon.activo) {
        const tipo = cupon.tipo;
        switch (tipo) {
          case "fixed":
            //Descuento de monto en dinero al total
            fixedDiscount(cupon);
            break;

          case "percentage":
            //Descuento de porcentaje al total
            percentageDiscount(cupon);
            break;

          case "buyAndSomeFree":
            buyAndSomeFreeDiscount(cupon);
            //Compra una cantidad y te llevas mas
            break;

          case "buySomeFixedPrice":
            buySomeFixedPriceDiscount(cupon);
            //Compra una cantidad por x precio
            break;
          default:
            break;
        }
      } else {
        res.json({
          code: 404,
          error: {
            message: "El cupon ya expiro",
          },
        });
      }
    } else {
      res.json({
        code: 404,
        error: {
          message: "Cupón no encontrado",
        },
      });
    }
  });
};
controller.nuevo_pedido = async (req, res) => {
  let cliente;
  let pedido;
  const {
    //personal
    nombres,
    apellido_paterno,
    apellido_materno,
    telefono,
    correo_electronico,
    //direcciones
    calle,
    numero,
    cp,
    colonia,
    municipio,
    estado,
    pais,
    //pedido
    costos,
    notas,
    productos_cuadrology,
  } = req.body;
  const status = "client";
  const marca = "Cuadrology";
  const fecha = new Date();

  cliente = await Cliente.findOne({ correo_electronico });
  if (cliente) {
    console.log("cliente existente");
    pedido = new Pedido({
      marca,
      fecha,
      productos_cuadrology,
      //envio
      costos,
      cliente: cliente._id,
      notas,
    });
    try {
      await pedido.save();
      cliente.pedidos.push(pedido);
      await cliente.save();
      res.status(200).json({
        pedido,
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("creando cliente");
    cliente = new Cliente({
      nombres,
      apellido_paterno,
      apellido_materno,
      telefono,
      correo_electronico,
      status,
    });
    pedido = new Pedido({
      marca,
      fecha,
      productos_cuadrology,
      //envio
      costos,
      cliente: cliente._id,
      notas,
    });
    cliente.direcciones.push({
      calle,
      numero,
      cp,
      colonia,
      municipio,
      estado,
      pais,
    });
    cliente.pedidos.push(pedido._id);
    try {
      await pedido.save();
      await cliente.save();
      res.status(200).json({
        pedido,
      });
    } catch (error) {
      console.log(error);
    }
  }
};
controller.review_pedido = async (req, res) => {
  if (req.body.cupon) {
    if (!req.body.cantidad_productos || !req.body.total) {
      res.sendStatus(400);
    }
    let { cupon } = req.body;
    const fixedDiscount = (cupon) => {
      // cantidad_productos, total
      console.log("fixed");
      let { cantidad_productos, total } = req.body;
      let { monto, precio_cuadro_extra } = cupon;
      const cantidad_productos_adicionales = parseInt(
        cantidad_productos - cantidad_minima_cuadros
      );
      if (cantidad_productos == cantidad_minima_cuadros) {
        total == precio_cantidad_minima_cuadros - monto //Comprueba que el total sea correcto
          ? res.json({
              code: 200,
              response: {
                total: precio_cantidad_minima_cuadros - monto,
              },
            })
          : res.json({
              code: 400,
              error: {
                message: "Datos manipulados",
              },
            });
      } else if (
        parseInt(cantidad_productos) > parseInt(cantidad_minima_cuadros)
      ) {
        if (precio_cuadro_extra) {
          let precio_estimado =
            precio_cantidad_minima_cuadros -
            monto +
            cantidad_productos_adicionales * precio_cuadro_extra;
          precio_estimado == total
            ? res.json({
                code: 200,
                response: {
                  total: precio_estimado,
                },
              })
            : res.json({
                code: 400,
                error: {
                  message: "Datos manipulados",
                },
              });
        } else {
          let precio_estimado =
            precio_cantidad_minima_cuadros -
            monto +
            cantidad_productos_adicionales * precio_unitario;
          precio_estimado == total
            ? res.json({
                code: 200,
                response: {
                  total: precio_estimado,
                },
              })
            : res.json({
                code: 400,
                error: {
                  message: "Datos manipulados",
                },
              });
        }
      }
    };
    const percentageDiscount = (cupon) => {
      //cantidad_productos, total
      console.log("percentage");
      let { cantidad_productos, total } = req.body;
      let { monto, precio_cuadro_extra } = cupon;
      const cantidad_productos_adicionales = parseInt(
        cantidad_productos - cantidad_minima_cuadros
      );
      if (cantidad_productos == cantidad_minima_cuadros) {
        const total_esperado =
          precio_cantidad_minima_cuadros -
          (precio_cantidad_minima_cuadros * monto) / 100;
        total == total_esperado //Comprueba que el total sea correcto
          ? res.json({
              code: 200,
              response: {
                total: total_esperado,
              },
            })
          : res.json({
              code: 400,
              error: {
                message: "Datos manipulados",
              },
            });
      } else if (cantidad_productos > cantidad_minima_cuadros) {
        if (precio_cuadro_extra) {
          let total_estimado =
            precio_cantidad_minima_cuadros -
            (precio_cantidad_minima_cuadros * monto) / 100 +
            cantidad_productos_adicionales * precio_cuadro_extra;
          total_estimado == total
            ? res.json({
                code: 200,
                response: {
                  total: total_estimado,
                },
              })
            : res.json({
                code: 400,
                error: {
                  message: "Datos manipulados",
                },
              });
        } else {
          let total_estimado =
            precio_cantidad_minima_cuadros -
            (precio_cantidad_minima_cuadros * monto) / 100 +
            cantidad_productos_adicionales * precio_unitario;
          total_estimado == total
            ? res.json({
                code: 200,
                response: {
                  total: total_estimado,
                },
              })
            : res.json({
                code: 400,
                error: {
                  message: "Datos manipulados",
                },
              });
        }
      }
    };
    const buyAndSomeFreeDiscount = (cupon) => {
      //cantidad_productos, total
      console.log("buyAndSomeFreeDiscount");
      let { cantidad_productos, total } = req.body;
      let { cantidad_llevar, cantidad_pagar, precio_cuadro_extra } = cupon;
      const cantidad_productos_adicionales = parseInt(
        cantidad_productos - cantidad_llevar
      );
      const cantidad_productos_adiciones_promo = parseInt(
        cantidad_pagar - cantidad_minima_cuadros
      );
      if (cantidad_productos == cantidad_llevar) {
        const total_esperado =
          parseInt(precio_cantidad_minima_cuadros) +
          parseInt(precio_unitario * cantidad_productos_adiciones_promo);
        total_esperado == total
          ? res.json({
              code: 200,
              response: {
                total: total_esperado,
              },
            })
          : res.json({
              code: 400,
              error: {
                message: "Datos manipulados",
              },
            });
      } else if (cantidad_productos > cantidad_llevar) {
        if (precio_cuadro_extra) {
          const total_esperado =
            parseInt(precio_cantidad_minima_cuadros) +
            parseInt(
              precio_cuadro_extra *
                (cantidad_productos_adicionales +
                  cantidad_productos_adiciones_promo)
            );
          // const total_esperado = (parseInt(precio_cantidad_minima_cuadros) + parseInt(precio_cuadro_extra * cantidad_productos_adicionales));
          total_esperado == total
            ? res.json({
                code: 200,
                response: {
                  total: total_esperado,
                },
              })
            : res.json({
                code: 400,
                error: {
                  message: "Datos manipulados",
                },
              });
        } else {
          const total_esperado =
            parseInt(precio_cantidad_minima_cuadros) +
            parseInt(
              precio_unitario *
                (cantidad_productos_adicionales +
                  cantidad_productos_adiciones_promo)
            );
          total_esperado == total
            ? res.json({
                code: 200,
                response: {
                  total: total_esperado,
                },
              })
            : res.json({
                code: 400,
                error: {
                  message: "Datos manipulados",
                },
              });
        }
      } else {
        res.sendStatus(400);
        return;
      }
    };
    const buySomeFixedPriceDiscount = (cupon) => {
      console.log("fixed price");
      let { cantidad_productos, total } = req.body;
      let { cantidad_llevar, cantidad_pagar, precio_cuadro_extra } = cupon;
      const cantidad_productos_adicionales = parseInt(
        cantidad_productos - cantidad_llevar
      );
      //const cantidad_productos_adiciones_promo = parseInt(cantidad_pagar - cantidad_minima_cuadros)
      if (cantidad_productos == cantidad_llevar) {
        const total_esperado = parseInt(cantidad_pagar);
        total_esperado == total
          ? res.json({
              code: 200,
              response: {
                total: total_esperado,
              },
            })
          : res.json({
              code: 400,
              error: {
                message: "Datos manipulados",
              },
            });
      } else if (cantidad_productos > cantidad_llevar) {
        if (precio_cuadro_extra) {
          const total_esperado =
            parseInt(cantidad_productos_adicionales) *
              parseInt(precio_cuadro_extra) +
            parseInt(cantidad_pagar);
          total_esperado == total
            ? res.json({
                code: 200,
                response: {
                  total: total_esperado,
                },
              })
            : res.json({
                code: 400,
                error: {
                  message: "Datos manipulados",
                },
              });
        } else {
          const total_esperado =
            parseInt(cantidad_productos_adicionales) *
              parseInt(precio_unitario) +
            parseInt(cantidad_pagar);
          total_esperado == total
            ? res.json({
                code: 200,
                response: {
                  total: total_esperado,
                },
              })
            : res.json({
                code: 400,
                error: {
                  message: "Datos manipulados",
                },
              });
        }
      } else {
        res.sendStatus(400);
        return;
      }
    };
    await Descuento.findOne({ codigo: cupon }, (err, cupon) => {
      if (err) {
        res.json({
          code: 500,
          error: {
            message: "Ocurrió un error al comprobar el cupon",
          },
        });
      }
      if (cupon) {
        if (cupon.activo) {
          const tipo = cupon.tipo;
          switch (tipo) {
            case "fixed":
              //Descuento de monto en dinero al total

              fixedDiscount(cupon);
              break;

            case "percentage":
              //Descuento de porcentaje al total
              percentageDiscount(cupon);
              break;

            case "buyAndSomeFree":
              buyAndSomeFreeDiscount(cupon);
              //Compra una cantidad y te llevas mas
              break;

            case "buySomeFixedPrice":
              buySomeFixedPriceDiscount(cupon);
              //Compra una cantidad por x precio
              break;
            default:
              break;
          }
        } else {
          res.json({
            code: 404,
            error: {
              message: "El cupon ya expiro",
            },
          });
        }
      } else {
        res.json({
          code: 404,
          error: {
            message: "Cupón no encontrado",
          },
        });
      }
    });
  } else {
    const { total, cantidad_productos } = req.body;
    if (!cantidad_productos || !total) {
      res.sendStatus(400);
    }
    if (cantidad_productos == cantidad_minima_cuadros) {
      if (total == precio_cantidad_minima_cuadros) {
        res.status(200).json({ ok: true });
      } else res.sendStatus(400);
    } else if (cantidad_productos > cantidad_minima_cuadros) {
      const productos_extras =
        parseInt(cantidad_productos) - parseInt(cantidad_minima_cuadros);
      const costo_productos_extras =
        productos_extras * parseInt(precio_unitario);
      const costo_total_esperado =
        parseInt(precio_cantidad_minima_cuadros) + costo_productos_extras;
      costo_total_esperado == total
        ? res.status(200).json({ ok: true })
        : res.sendStatus(400);
    }
  }
};

module.exports = controller;
