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

export const fetchVehicles = async () => {
  console.log('Fetching vehicles...');
  return [
    { id: 'v1', name: 'CyberTruck MTW Edition', price: '500 MTW', image: 'https://placehold.co/400x300?text=CyberTruck' },
    { id: 'v2', name: 'MetaRover 5', price: '1200 MTW', image: 'https://placehold.co/400x300?text=MetaRover' }
  ];
};

export const placeBet = async (amount: number, gameType: number, parcelId: string) => {
  console.log(`Placing bet of ${amount} on game ${gameType} at parcel ${parcelId}`);
  // In a real app, this would call the contract via ethers.js
  return { success: true, requestId: '0x' + Math.random().toString(16).slice(2) };
};

export const fetchAgents = async () => {
  console.log('Fetching AI agents...');
  try {
    const response = await fetch('http://localhost:3005/agents');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch agents:', error);
    return [
      { id: 'agent-1', personality: { name: 'Diamond Dave', type: 'CONCIERGE' }, currentAction: 'IDLE' }
    ];
  }
};

export const interactWithAgent = async (agentId: string, userId: string, message: string) => {
  console.log(`Interacting with agent ${agentId}: ${message}`);
  try {
    const response = await fetch(`http://localhost:3005/agents/${agentId}/interact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, message })
    });
    return await response.json();
  } catch (error) {
    console.error('Agent interaction failed:', error);
    return { response: 'System offline.' };
  }
};

export const fetchOwnedAssets = async (address: string) => {
  console.log('Fetching assets for address:', address);
  return [
    { id: '1', name: 'Eiffel Tower Parcel', type: 'LAND', tier: 'DISTRICT', image: '...' },
    // ...
  ];
};
