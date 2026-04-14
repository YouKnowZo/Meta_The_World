export const fetchParcels = async (bbox: string) => {
  // Mocking API call
  console.log('Fetching parcels for bbox:', bbox);
  return [
    {
      id: 'p1',
      token_id: '12345',
      tier: 'DISTRICT',
      owner_address: '0x123...',
      geometry: {
        type: 'Polygon',
        coordinates: [[[2.35, 48.85], [2.36, 48.85], [2.36, 48.86], [2.35, 48.86], [2.35, 48.85]]]
      }
    }
  ];
};

export const fetchOwnedAssets = async (address: string) => {
  console.log('Fetching assets for address:', address);
  return [
    { id: '1', name: 'Eiffel Tower Parcel', type: 'LAND', tier: 'DISTRICT', image: '...' },
    // ...
  ];
};
