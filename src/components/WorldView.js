import React, { useEffect, useRef, useState } from 'react';
import { WorldEngine } from '../engine/WorldEngine';
import { useUserStore } from '../stores/userStore';
import { useRealEstateStore } from '../stores/realEstateStore';
import PropertyPanel from './PropertyPanel';
import RealEstateAgentPanel from './RealEstateAgentPanel';
import UserHUD from './UserHUD';
import './WorldView.css';

const WorldView = () => {
  const containerRef = useRef(null);
  const engineRef = useRef(null);
  const [showPropertyPanel, setShowPropertyPanel] = useState(false);
  const [showAgentPanel, setShowAgentPanel] = useState(false);
  
  const user = useUserStore((state) => state.user);
  const role = useUserStore((state) => state.role);
  const selectedProperty = useRealEstateStore((state) => state.selectedProperty);
  const properties = useRealEstateStore((state) => state.properties);
  const initializeProperties = useRealEstateStore((state) => state.initializeProperties);
  const addProperty = useRealEstateStore((state) => state.addProperty);
  
  const handlePropertyClick = React.useCallback((propertyId) => {
    const property = properties.find(p => p.id === propertyId);
    if (property && engineRef.current) {
      useRealEstateStore.getState().selectProperty(propertyId);
      // Move camera to property
      const prop = engineRef.current.properties.find(
        p => p.userData.propertyId === propertyId
      );
      if (prop) {
        engineRef.current.camera.position.set(
          prop.position.x + 30,
          prop.position.y + 30,
          prop.position.z + 30
        );
        engineRef.current.controls.target.copy(prop.position);
      }
    }
  }, [properties]);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Initialize world engine
    engineRef.current = new WorldEngine(containerRef.current);
    
    // Initialize properties
    initializeProperties();
    
    return () => {
      if (engineRef.current) {
        engineRef.current.dispose();
      }
    };
  }, [initializeProperties]);
  
  useEffect(() => {
    if (!engineRef.current || properties.length === 0) return;
    
    // Add properties to the world
    properties.forEach((property) => {
      const existing = engineRef.current.properties.find(
        p => p.userData.propertyId === property.id
      );
      if (!existing) {
        engineRef.current.addProperty(property);
      }
    });
    
    // Set up property click handler
    if (engineRef.current) {
      engineRef.current.setOnPropertyClick(handlePropertyClick);
    }
  }, [properties, handlePropertyClick]);
  
  useEffect(() => {
    if (selectedProperty) {
      setShowPropertyPanel(true);
      if (engineRef.current) {
        engineRef.current.highlightProperty(selectedProperty.id, true);
      }
    } else {
      setShowPropertyPanel(false);
    }
    
    return () => {
      if (engineRef.current && selectedProperty) {
        engineRef.current.highlightProperty(selectedProperty.id, false);
      }
    };
  }, [selectedProperty]);
  
  useEffect(() => {
    if (role === 'realEstateAgent') {
      setShowAgentPanel(true);
    }
  }, [role]);
  
  return (
    <div className="world-view">
      <div ref={containerRef} className="world-container" />
      
      <UserHUD />
      
      {showPropertyPanel && selectedProperty && (
        <PropertyPanel
          property={selectedProperty}
          onClose={() => {
            useRealEstateStore.getState().clearSelection();
            if (engineRef.current && selectedProperty) {
              engineRef.current.highlightProperty(selectedProperty.id, false);
            }
          }}
          onPurchase={() => {
            // Handle purchase
            console.log('Purchase property:', selectedProperty.id);
          }}
        />
      )}
      
      {showAgentPanel && role === 'realEstateAgent' && (
        <RealEstateAgentPanel
          onClose={() => setShowAgentPanel(false)}
        />
      )}
      
      <div className="world-controls">
        <button
          className="control-button"
          onClick={() => {
            if (role === 'realEstateAgent') {
              setShowAgentPanel(!showAgentPanel);
            }
          }}
          disabled={role !== 'realEstateAgent'}
        >
          {role === 'realEstateAgent' ? '🏠 Agent Dashboard' : 'Become an Agent'}
        </button>
      </div>
    </div>
  );
};

export default WorldView;
