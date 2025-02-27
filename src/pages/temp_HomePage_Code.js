// import React, { useState, useCallback, useEffect } from "react";
// import {
//   IonPage,
//   IonHeader,
//   IonToolbar,
//   IonTitle,
//   IonContent,
//   IonList,
//   IonButton,
//   IonIcon,
//   IonInput,
//   IonButtons,
//   IonMenuButton,
//   IonMenu,
//   IonSearchbar,
//   IonSelectOption,
//   IonFabList,
// } from "@ionic/react";
// import { useIonViewDidEnter } from "@ionic/react";
// import { Storage } from "@capacitor/storage";
// import { search, close } from "ionicons/icons";

// import SlokaCard from "../components/SlokaCard";
// import SelectSloka from "./SelectSloka";
// import CustomAlert from "../components/CustomAlert";
// import MenuBar from "../components/MenuBar";

// const HomePage = ({ history }) => {
//   const [slokas, setSlokas] = useState([]);
//   const [showPlaylist, setShowPlaylist] = useState(false);
//   const [alertVisible, setAlertVisible] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);
//   const [isSearchVisible, setIsSearchVisible] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filteredSlokas, setFilteredSlokas] = useState([]);
//   const [currentPlayingId, setCurrentPlayingId] = useState(null);

//   // Load slokas when view is entered
//   useIonViewDidEnter(() => {
//     const loadSlokas = async () => {
//       const { value } = await Storage.get({ key: "slokas" });
//       if (value) {
//         const parsedSlokas = JSON.parse(value);
//         setSlokas(parsedSlokas);
//         setFilteredSlokas(parsedSlokas);
//       }
//     };
//     loadSlokas();
//   });

//   // Toggle search bar visibility
//   const toggleSearch = useCallback(() => {
//     setIsSearchVisible((prev) => {
//       if (!prev) {
//         setSearchQuery("");
//         setFilteredSlokas(slokas);
//       } else {
//         setFilteredSlokas(slokas);
//       }
//       return !prev;
//     });
//   }, [slokas]);

//   // Filter slokas based on search query
//   const filterSlokas = useCallback(
//     (query) => {
//       if (query.trim() === "") {
//         setFilteredSlokas(slokas);
//       } else {
//         const filtered = slokas.filter((sloka) =>
//           sloka.title.toLowerCase().includes(query.toLowerCase())
//         );
//         setFilteredSlokas(filtered);
//       }
//     },
//     [slokas]
//   );

//   // Playback control
//   const handlePlay = useCallback((id) => {
//     setCurrentPlayingId((prevId) => (prevId === id ? null : id));
//   }, []);

//   // Delete functionality
//   const deleteSloka = useCallback(
//     async (id) => {
//       const updatedSlokas = slokas.filter((sloka) => sloka.id !== id);
//       await Storage.set({
//         key: "slokas",
//         value: JSON.stringify(updatedSlokas),
//       });
//       setSlokas(updatedSlokas);
//       setFilteredSlokas(updatedSlokas);
//       setAlertVisible(false);
//     },
//     [slokas]
//   );

//   const confirmDelete = useCallback((id) => {
//     setDeleteId(id);
//     setAlertVisible(true);
//   }, []);

//   return (
//     <>
//       <MenuBar />
//       <IonPage id="main-content">
//         <IonHeader>
//           <IonToolbar color={"primary"}>
//             <IonButtons slot="start">
//               <IonMenuButton></IonMenuButton>
//             </IonButtons>
//             {/* <IonTitle>Menu</IonTitle> */}
//             <IonSearchbar></IonSearchbar>
//           </IonToolbar>
//         </IonHeader>
//         <IonContent fullscreen className="ion-padding">
//           <IonList>
//             {filteredSlokas.map((item, index) => (
//               <SlokaCard
//                 key={item.id}
//                 sloka={item}
//                 serialNo={index + 1}
//                 onDelete={() => confirmDelete(item.id)}
//                 navigation={history}
//                 currentPlayingId={currentPlayingId}
//                 onPlay={handlePlay}
//                 href = {`/home/${item.id}`}
//               />
//             ))}
//           </IonList>

//           {/* <SelectSloka
//           visible={showPlaylist}
//           slokas={slokas}
//           onClose={() => setShowPlaylist(false)}
//         /> */}

//           <div
//             style={{
//               display: "flex",
//               justifyContent: "Center",
//               padding: "12px 0",
//               gap: "8px",
//             }}
//           >
//             {/* <IonButton
//               expand="block"
//               color="primary"
//               href="/selectSloka"
//             >
//               Select Slokas
//             </IonButton> */}
//             {/* <ion-button href="/addSloka" expand="block" color="secondary">
//               <span>Add Sloka</span>
//             </ion-button> */}
//             {/* <IonButton expand="block" color="secondary" onClick={() => history.push('/addSloka')}>
//             Add Sloka
//           </IonButton> */}
//           </div>

//           <CustomAlert
//             visible={alertVisible}
//             title="Delete Sloka"
//             message="Are you sure you want to delete this sloka?"
//             buttons={[
//               {
//                 text: "Cancel",
//                 role: "cancel",
//                 handler: () => setAlertVisible(false),
//               },
//               {
//                 text: "Delete",
//                 role: "destructive",
//                 handler: () => deleteSloka(deleteId),
//               },
//             ]}
//           />
//         </IonContent>
//       </IonPage>
//     </>
//   );
// };

// export default HomePage;