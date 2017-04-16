const decipherLibnameTableName=function(indsname){

  var  libname=''
     , tablename=''
     , origlib=''
     , origtbl=''
     ;

  function occurnaceFinder(string,findToken){
    var counter=0;
    if (string.length > 0 && string.indexOf(findToken) !=-1 ){
       for(var i=0; i<=string.length; i++){
          if (string[i]==findToken) counter++;
       }
    }
   return counter;
  }

  if (indsname.trim()=='' || indsname.trim()=='_NULL_') return {libname:'',tablename:''}

  var _temp=indsname.replace(/\&[\w]+\./g,"`");

  if (_temp.indexOf(".") == -1 ) { 
      libname  ="WORK"; 
      tablename=indsname;
  } 
  else { 
     libname  =_temp.split(".")[0]; 
     tablename=_temp.split(".")[1]; 
  }
    var _temp_breakup=indsname.split(".").filter(x=>x.length>0);
    var l_count=occurnaceFinder(libname,"`");
    var t_count=occurnaceFinder(tablename,"`");

    if (l_count == 0) origlib=libname;
    else {
      for(var j =0 ; j < l_count ; j++){
         origlib=origlib + _temp_breakup[j]  
         if(j+1!=l_count) origlib=origlib + "."
      }
    }

    if (t_count == 0) origtbl=tablename;
    else {
      for(var j =l_count ; j < _temp_breakup.length ; j++){
         origtbl=origtbl + _temp_breakup[j] 
         if(j+1!=_temp_breakup.length) origtbl=origtbl + "."
      }
    }

    return {
        libname:origlib
      , tablename:origtbl
    }
}

exports.decipherLibnameTableName=decipherLibnameTableName;