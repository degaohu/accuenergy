<template>

<div class="fullContent">
  <el-row :gutter="20">
    <el-col :span="7">
      <el-card class="SearchArea" shadow="hover" >
        <template #header>
          <div class="card-header">
            

            



<div  style="display:flex; justify-content:space-between">
  <el-tooltip content="Locate and Add your Current Location" placement="top" effect="dark">
            <el-button :icon="Location" @click="getBrowserLocation"> Get My Location </el-button>
          </el-tooltip>

            <div>
            <el-autocomplete
    v-model="state"
    :fetch-suggestions="toSearch"
    :clearable="true"
    placeholder="Address Search"
    :trigger-on-focus="false"
    @select="handleSelect"
    style="margin-bottom: 20px;"
    ref="SearchInput"
    :class="{ shake: isShaking }"
    @keyup.enter="searchLocation"
  />

  <el-button @click="searchLocation" :icon="AddLocation"  type="success">Add </el-button>
  </div>

  </div>

          </div>
        </template>
        
        <div  style="display:flex; justify-content: space-between; align-items: center; align-content: center;  margin-bottom:  5px;"> 
        <el-tag style="margin-bottom:10px" plain hit round  type="info" > My History </el-tag>

          
        
        <el-button v-if="HomePage.Selected.length>0" type="danger" :icon="Delete" size="default" @click="removeHistory" />
        </div>



        <el-table
    ref="multipleTableRef"
    :data="HomePage.PaginationSearchTable"
    style="width: 100%; border-radius: 20px;"
    @selection-change="handleSelectionChange"
    size="small"
   max-height="800"
   highlight-current-row
  >

  <template #empty>
  
    <el-empty :image-size="200" />

    <el-button @click="FocusSearch" :icon="Search" type="primary" >  Search Right Now !</el-button>
  
  </template>
  
  
  <el-table-column type="selection" width="55" />
  <el-table-column  :formatter="DateFormatter" fixed property="time" label="Date"  sortable  width="120"/>

    <el-table-column   label="Name" show-overflow-tooltip width="350"  >  
      <template #default="scope">

        <el-tooltip  placement="top">
          <template #content> Latitude : {{ scope.row.latitude}}<br />
          
            Longitude : {{scope.row.longitude}}
          </template>
            <el-tag   round size="large hit"> {{ scope.row.name }}</el-tag>
        </el-tooltip>
         
      </template>
    </el-table-column>



    <el-table-column label="Operations">
      <template #default="scope">
        

        <el-tooltip  content="Find your Address" placement="top">
        <el-button size="large" :icon="Aim" @click="ResetCenter(scope.row.latitude, scope.row.longitude)"
          />
          </el-tooltip>

      </template>
    </el-table-column>




  </el-table>


  <div style="width: 100%;">
  <el-pagination  background style="width: 100%; margin-top: 10px;" layout="prev, pager, next" :total="HomePage.TotalPageNumber" page-sizes ='10' @current-change="handleCurrentChange"/>
  </div>
       
      </el-card>

      
    </el-col>








    <el-col :span="16">
      <div class="Map">
      
      
      
        <!-- <GoogleMap
    api-key="AIzaSyBKLrJ2T-kU96j3yC2VqArY0B1Ap9dU7UE"
    style="width: 100%; height: 700px"
    :center="center"
    :zoom="15"
    >
        <Marker :options="{ position: center }" />
    </GoogleMap> -->
      <el-card>

    <GMapMap
      :center="Google.center"
      :zoom="15"
      map-type-id="terrain"
      style="width: 100%; height:810px"
  >
  <GMapMarker
      :key="index"
      v-for="(m, index) in Google.markers"
      :position="m.position"
      :clickable="true"
      :draggable="false"
      @click="Google.center = m.position"
    />
  </GMapMap>
      
      </el-card>
      
      
      </div>
    </el-col>
  </el-row>

</div>

</template>

<script setup>
import { Search,Location,Delete,AddLocation,Aim } from "@element-plus/icons-vue";
import { reactive ,ref,onMounted } from "vue";
import {
  ElMessage,ElMessageBox 
} from "element-plus";
import { watch } from "vue";
import { GoogleMap, Marker } from 'vue3-google-map'
import GoogleMapService from '/services/GooglemapService'



const  SearchInput = ref(null)

const state = ref('')



onMounted(() => {
  SearchInput;



});




const HomePage = reactive({
  AddressSearch: '',
  SearchTable: "",
  PaginationSearchTable: "",
  Selected: '',
  page: '',
  pageLimit : 10,
  TotalPageNumber : ''
});


const Google = reactive({
  center : '',
  markers: []
})






const toSearch =async (str, cb) =>{

  let CBresult = []
  let description = ''
  
  await GoogleMapService.getAutocompleteResults(str).then((result) => {
      //console.log(result)
      
      


      for (const element of result) {
        description = element.description,
   //  console.log(description),
    CBresult.push({value: description})
    }


    

    }).catch((err) => {
    //  console.error(err);
    });
   //console.log(CBresult)

    cb(CBresult)
    
}


const handleSelect = async (prediction) => {
  console.log(prediction.value)
  
  //  let GeoLocation  = ''
   let now = new Date();


    HomePage.AddressSearch = prediction.value
   
 
    
}


watch(
  () => HomePage.SearchTable,
  (result) => {
    
    if (result == null ) {
      HomePage.TotalPageNumber = 1 
    } else {
      HomePage.TotalPageNumber = result.length

      const sortedResult = [...result].reverse();

        HomePage.TotalPageNumber = sortedResult.length

      HomePage.PaginationSearchTable = sortedResult.filter(
        (item, index) =>
          index < HomePage.page * HomePage.pageLimit &&
          index >= (HomePage.page - 1) * HomePage.pageLimit
      );
    }

    Google.markers= [] 
    result.forEach(element => {
      
    

      let marker = {
          position: {
            lat: element.latitude, lng: element.longitude
          },
        }

        
        Google.markers.push(marker)


    });

    










    }

  
);




const FirstLoadPage = () => {
  

    Google.center = {lat: 43.653908 ,lng:  -79.384293 }

  
  HomePage.SearchTable = JSON.parse(localStorage.getItem('SearchHistory'))

  //  Initialize Page Number 
  HomePage.page = 1

  if (HomePage.SearchTable){
    HomePage.SearchTable = JSON.parse(localStorage.getItem('SearchHistory'))
    
  }else {
    HomePage.SearchTable = []
  }
  

    const sortedResult = [...HomePage.SearchTable].reverse();

HomePage.TotalPageNumber = sortedResult.length

HomePage.PaginationSearchTable = sortedResult.filter(
(item, index) =>
  index < HomePage.page * HomePage.pageLimit &&
  index >= (HomePage.page - 1) * HomePage.pageLimit
);




  console.log( HomePage.SearchTable)
  console.log(HomePage.PaginationSearchTable);

  

  
}


const getBrowserLocation =  async () => {
  navigator.geolocation.getCurrentPosition(async (position) => {
    //console.log(position.coords); 
    

    HomePage.HomeAddress = {lat: position.coords.latitude ,lng: position.coords.longitude }


    console.log(HomePage.HomeAddress)
    let locationName= '';
    let now = new Date();
    position.coords.latitude 
    position.coords.longitude


    await GoogleMapService.getAddress(position.coords.latitude,position.coords.longitude).then((result) => {
      locationName = result

      console.log(result)
      
    }).catch((err) => {
      
    });
    
   
    const history = {
      name : locationName,
      latitude : position.coords.latitude ,
      longitude : position.coords.longitude,
      time : now 
    }





  let  SearchHistory =  localStorage.getItem('SearchHistory')

  let  searchHistoryArray = []

  searchHistoryArray

  if (SearchHistory){
    searchHistoryArray = JSON.parse(SearchHistory);

    console.log(searchHistoryArray)
  }


  const isHistoryIncluded = searchHistoryArray.some(item =>
  item.latitude === history.latitude && item.longitude === history.longitude
);


  if(isHistoryIncluded == false){
    searchHistoryArray.push(history)
  }else 
  {
    ElMessage({
    message: 'Same Addres has been added to your hisotry , Plesae double check your data',
    type: 'error',
  })
  }

   const  updatedSearchHistoryArray = JSON.stringify(searchHistoryArray)
   localStorage.setItem('SearchHistory',updatedSearchHistoryArray)
   HomePage.SearchTable = searchHistoryArray
    

  });



};

const searchLocation = async () => {
  let GeoLocation = ''  
  let now = new Date();
  let LocationName = ''
  if (HomePage.AddressSearch != null  && HomePage.AddressSearch != ''){
  await GoogleMapService.getLatLng(HomePage.AddressSearch).then((result) => {     
      GeoLocation = result
   }).catch((err) => {
      console.log(err)
   });

    console.log(GeoLocation)
   

    await GoogleMapService.getAddress(GeoLocation.lat,GeoLocation.lng).then((result) => {
      LocationName = result
    }).catch((err) => {
      
    });

    
  Google.center = {lat: GeoLocation.lat,lng: GeoLocation.lng}


  const history = {
      name : LocationName,
      latitude : GeoLocation.lat ,
      longitude : GeoLocation.lng,
      time : now 
    }
      
    console.log()
    HomePage.SearchTable.push(history)

  let  SearchHistory =  localStorage.getItem('SearchHistory')

  let  searchHistoryArray = []


  if (SearchHistory){
    searchHistoryArray = JSON.parse(SearchHistory);
  }

  const isHistoryIncluded = searchHistoryArray.some(item =>
  item.latitude === history.latitude && item.longitude === history.longitude
);


  if(isHistoryIncluded == false){
    searchHistoryArray.push(history)

    ElMessage({
    message: 'Address Has Been Added',
    type: 'success',
  })

  }else 
  {
    ElMessage({
    message: 'Same Addres has been added to your hisotry , Plesae double check your data',
    type: 'error',
  })
  }

   const  updatedSearchHistoryArray = JSON.stringify(searchHistoryArray)
   localStorage.setItem('SearchHistory',updatedSearchHistoryArray)
   HomePage.SearchTable = searchHistoryArray

  
  }

};



const handleSelectionChange  = (val) =>{

  HomePage.Selected = '';
  console.log(val)

  HomePage.Selected= val;


  console.log('sELECT'+ HomePage.Selected)

}


const handleCurrentChange =(e)=>{
  HomePage.page = e 



const sortedResult = [...HomePage.SearchTable].reverse();

HomePage.TotalPageNumber = sortedResult.length

HomePage.PaginationSearchTable = sortedResult.filter(
(item, index) =>
  index < HomePage.page * HomePage.pageLimit &&
  index >= (HomePage.page - 1) * HomePage.pageLimit
);


     



}



const FocusSearch =()=>{
 
 
 SearchInput.value.focus();

 isShaking.value=true;

 setTimeout(() => { isShaking.value = false }, 500);

  localStorage.clear();

}


const removeHistory= ()=> {

    let NewSearchTable = HomePage.SearchTable



    ElMessageBox.confirm(
    'Are you Sure You Want To Delete Theses History?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(() => {

      HomePage.Selected.forEach(selected => {
      console.log(selected)

      NewSearchTable  = NewSearchTable.filter(item => (item.latitude !== selected.latitude) && (item.longitude !== selected.longitude) )

      //Update NewSearTable
      HomePage.SearchTable = NewSearchTable

      //Update Local Storage 
      localStorage.setItem('SearchHistory', JSON.stringify(HomePage.SearchTable))
      
    });


      ElMessage({
        type: 'success',
        message: 'Delete completed',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled',
      })
    })
    

    


    
}


const DateFormatter =(row,column,cellValue) =>{
  const date = new Date(cellValue);
      const options = {
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit'
      };
      return date.toLocaleString(undefined, options); // 返回格式化后的日期，如 "MM/DD/YYYY, HH:MM"
    }

const ResetCenter = (latitude,longitude) => {
 

  Google.center = {lat: latitude,lng: longitude }
}


FirstLoadPage();

</script>

<style scoped>

.card-header{
  margin-top: 12px;
}
.SearchArea {
  margin-left: 10px;
  background-color: rgb(123, 171, 216);
  height: 810px;
  border: 5px;
  border-radius: 10px;
}


@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }
  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}


.shake {
  animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
  transform: translate3d(0, 0, 0);
}



</style>
