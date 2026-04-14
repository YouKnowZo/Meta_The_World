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

export const placeBet = async (amount: string, gameType: number, parcelId: string) => {
  console.log(`Placing bet: ${amount} MTW on game type ${gameType} at parcel ${parcelId}`);
  // In real implementation:
  // const tx = await diamondDistrictContract.placeBet(ethers.parseEther(amount), gameType, parcelId);
  // await tx.wait();
  return { requestId: "0x" + Math.random().toString(16).slice(2) };
};

export const fetchVehicles = async () => {
  console.log('Fetching vehicles from dealership');
  return [
    { id: 'v1', name: 'CyberTruck', price: '1000', currency: 'MTW', image: '/vehicles/cybertruck.png' },
    { id: 'v2', name: 'Roadster', price: '2500', currency: 'MTW', image: '/vehicles/roadster.png' }
  ];
};

export const buyVehicle = async (vehicleId: string) => {
  console.log(`Buying vehicle: ${vehicleId}`);
  // In real implementation:
  // const tx = await dealershipContract.buyVehicle(vehicleId);
  // await tx.wait();
  return { success: true };
};

export const interactWithAgent = async (agentId: string, message: string, playerId: string) => {
  const response = await fetch(`/api/agents/${agentId}/interact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, playerId })
  });
  return response.json();
};
