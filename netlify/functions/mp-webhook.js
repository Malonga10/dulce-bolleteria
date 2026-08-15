// netlify/functions/mp-webhook.js
//
// Mercado Pago llama a esta función automáticamente cada vez que
// hay una novedad en un pago (aprobado, rechazado, etc.).
// Cuando el pago está aprobado, mandamos un correo con los detalles.

exports.handler = async function (event) {
  try {
    // Mercado Pago manda la notificación como querystring o como body,
    // dependiendo del tipo de evento. Cubrimos ambos casos.
    const params = event.queryStringParameters || {};
    let paymentId = params['data.id'] || params.id;

    if (!paymentId && event.body) {
      try {
        const body = JSON.parse(event.body);
        paymentId = body?.data?.id || body?.id;
      } catch (e) {
        // el body no era JSON, lo ignoramos
      }
    }

    if (!paymentId) {
      // No es una notificación de pago que nos interese (puede ser un ping de prueba)
      return { statusCode: 200, body: 'ok' };
    }

    // Pedimos los detalles completos de ese pago a Mercado Pago
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
    });
    const payment = await mpRes.json();

    // Solo notificamos si el pago fue aprobado (para no llenarte de correos de intentos fallidos)
    if (payment.status !== 'approved') {
      return { statusCode: 200, body: 'ok' };
    }

    const meta = payment.metadata || {};
    const itemsList = (payment.additional_info?.items || [])
      .map((it) => `• ${it.quantity}x ${it.title} — $${it.unit_price}`)
      .join('\n');

    const entregaTexto = meta.entrega === 'recoger'
      ? 'Recoger en local (50 Avenida entre 6 y 8 Norte, Col. 10 de Abril, casa blanca de 2 pisos #381)'
      : 'Envío a domicilio';

    const emailBody = `
¡Nuevo pedido pagado con tarjeta! 🎉

Total: $${payment.transaction_amount}
Método de entrega: ${entregaTexto}
Teléfono del cliente (WhatsApp): ${meta.telefono || 'No proporcionado'}
Notas del cliente: ${meta.nota || '(sin notas)'}

Productos:
${itemsList}

ID del pago en Mercado Pago: ${payment.id}
    `.trim();

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Dulce Bolletería <onboarding@resend.dev>',
        to: process.env.NOTIFY_EMAIL,
        subject: '🍞 Nuevo pedido pagado con tarjeta',
        text: emailBody,
      }),
    });

    return { statusCode: 200, body: 'ok' };
  } catch (err) {
    console.error('Error en webhook:', err);
    // Igual respondemos 200 para que Mercado Pago no siga reintentando
    return { statusCode: 200, body: 'ok' };
  }
};