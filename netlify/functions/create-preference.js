exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Método no permitido' };
  }

  try {
    const { items, note, deliveryMethod } = JSON.parse(event.body);

    if (!items || items.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Carrito vacío' }) };
    }

    const mpItems = items.map((it) => ({
      title: it.name + (it.sizeLabel ? ` (${it.sizeLabel})` : ''),
      quantity: it.qty,
      unit_price: Number(it.price),
      currency_id: 'MXN',
    }));

    // Solo agregamos envío si el cliente eligió domicilio
    if (deliveryMethod === 'domicilio') {
      mpItems.push({
        title: 'Envío a domicilio',
        quantity: 1,
        unit_price: 35,
        currency_id: 'MXN',
      });
    }

    const siteUrl = process.env.URL || 'https://malonga10.github.io/dulce-bolleteria';

    const preference = {
      items: mpItems,
      back_urls: {
        success: `${siteUrl}/pago-exitoso.html`,
        failure: `${siteUrl}/pago-fallido.html`,
        pending: `${siteUrl}/pago-pendiente.html`,
      },
      auto_return: 'approved',
      statement_descriptor: 'DULCE BOLLETERIA',
      metadata: { nota: note || '' },
    };

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(preference),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error de Mercado Pago:', data);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'No se pudo crear el pago', detail: data }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ init_point: data.init_point }),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Error interno' }) };
  }
};