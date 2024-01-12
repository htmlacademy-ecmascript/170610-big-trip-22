const createOffersSectionTemplateTemplate = (hasTypeOffers, typeOffers, pointOffersIds, isDisabled) => (

  `${hasTypeOffers ? `
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">

    ${typeOffers.map(({ id, title, price }) => {

    const offerLastWord = title.split(' ').pop().replace(/-/g, '');
    const checked = pointOffersIds.includes(id) ? 'checked' : '';

    return `
        <div class="event__offer-selector">
          <input
            class="event__offer-checkbox visually-hidden"
            id="event-offer-${offerLastWord}-${id}"
            type="checkbox"
            name="event-offer-${offerLastWord}"
            ${checked}
            ${isDisabled ? 'disabled' : ''}
          >
          <label class="event__offer-label"
            for="event-offer-${offerLastWord}-${id}">
            <span class="event__offer-title">${title}</span>
            +€&nbsp;
            <span class="event__offer-price">${price}</span>
          </label>
      </div>`;
  }).join('')}
        </div>
    </section>
  ` : ''
  } `
);


export default createOffersSectionTemplateTemplate;

