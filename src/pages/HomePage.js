import React, { useState, useCallback } from "react";
import {
  IonRefresherContent,
  IonRefresher,
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonSearchbar,
  IonImg,
  IonContent,
  IonList,
  IonText,
} from "@ionic/react";
import { useIonViewDidEnter } from "@ionic/react";
import SlokaCard from "../components/SlokaCard";
import CustomAlert from "../components/CustomAlert";
import MenuBar from "../components/MenuBar";
import IYSImage from "../assets/IYS2.png";
import dataManager from "../services/DataManager";

const HomePage = ({ history }) => {
  const [slokas, setSlokas] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSlokas, setFilteredSlokas] = useState([]);
  const [currentPlayingId, setCurrentPlayingId] = useState(null);

  // Load slokas when view is entered
  useIonViewDidEnter(() => {
    const loadSlokas = async () => {
      console.log("HomePage: Loading slokas...");
      const slokas = await dataManager.getSlokas();
      console.log("HomePage: Loaded slokas:", slokas);
      setSlokas(slokas);
      setFilteredSlokas(slokas);
    };
    loadSlokas();
  });

  const handleRefresh = async (event) => {
    // Simulate a network request
    setTimeout(async () => {
      // Fetch new data and update state
      const slokas = await dataManager.getSlokas();
      setSlokas(slokas);
      setFilteredSlokas(slokas);
      event.detail.complete();
    }, 2000);
  };

  // Handle search input changes
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredSlokas(slokas);
    } else {
      const filtered = slokas.filter((sloka) =>
        sloka.title.toLowerCase().includes(query)
      );
      setFilteredSlokas(filtered);
    }
  };

  // Playback control
  const handlePlay = useCallback((id) => {
    setCurrentPlayingId((prevId) => (prevId === id ? null : id));
  }, []);

  // Delete functionality
  const deleteSloka = useCallback(
    async (id) => {
      const success = await dataManager.deleteSloka(id);
      if (success) {
        const updatedSlokas = slokas.filter((sloka) => sloka.id !== id);
        setSlokas(updatedSlokas);
        setFilteredSlokas(updatedSlokas);
      }
      setAlertVisible(false);
    },
    [slokas]
  );

  const confirmDelete = useCallback((id) => {
    setDeleteId(id);
    setAlertVisible(true);
  }, []);

  return (
    <>
      <MenuBar />
      <IonPage id="main-content" className="dark-bg">
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonSearchbar
              value={searchQuery}
              onIonInput={handleSearch}
              debounce={200}
              placeholder="Search Slokas"
            />
            <IonImg
              src={IYSImage}
              style={{
                width: "40px",
                height: "40px",
                marginLeft: "8px",
                margin: "10px",
              }}
              slot="end"
            />
          </IonToolbar>
        </IonHeader>
        <IonContent
          fullscreen
          className="ion-padding dark-bg"
          style={{ background: "#121212" }}
        >
          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent />
          </IonRefresher>
          {filteredSlokas.length === 0 ? (
            <div className="ion-text-center ion-margin-top">
              <IonText color="medium" style={{ fontSize: "18px" }}>
                Click on Add Sloka for adding your sloka
              </IonText>
            </div>
          ) : (
            <IonList>
              {filteredSlokas.map((item, index) => (
                <SlokaCard
                  key={item.id}
                  sloka={item}
                  serialNo={index + 1}
                  onDelete={() => confirmDelete(item.id)}
                  navigation={history}
                  currentPlayingId={currentPlayingId}
                  onPlay={handlePlay}
                  href={`/home/${item.id}`}
                />
              ))}
            </IonList>
          )}

          <CustomAlert
            visible={alertVisible}
            title="Delete Sloka"
            message="Are you sure you want to delete this sloka?"
            buttons={[
              {
                text: "Cancel",
                role: "cancel",
                handler: () => setAlertVisible(false),
              },
              {
                text: "Delete",
                role: "destructive",
                handler: () => deleteSloka(deleteId),
              },
            ]}
          />
        </IonContent>
      </IonPage>
    </>
  );
};

export default HomePage;
