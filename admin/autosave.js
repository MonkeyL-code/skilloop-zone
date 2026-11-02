'use strict';
(() => {
 window.createDraftAutosave=({save,onState,onError,clock=window,idleMs=1000,maxMs=5000})=>{
  let idle=null,deadline=null,dirty=false,disposed=false,composing=false,paused=false;
  let revision=0,running=null;
  function clear(){clock.clearTimeout(idle);clock.clearTimeout(deadline);idle=deadline=null;}
  function flush(){
   if(disposed||composing)return Promise.resolve(false);
   paused=false;
   if(running)return running;
   if(!dirty)return Promise.resolve(true);
   clear();
   running=(async()=>{
    while(dirty&&!disposed&&!paused&&!composing){
     const savingRevision=revision;
     onState('saving');
     try{await save();}
     catch(error){
      clear();
      if(!disposed){onState('error');onError(error);}
      return false;
     }
     if(disposed)return false;
     dirty=revision!==savingRevision;
     if(!dirty){onState('saved');return true;}
     onState('dirty');
    }
    return !dirty;
   })().finally(()=>{running=null;});
   return running;
  }
  function arm(){
   clock.clearTimeout(idle);
   if(composing||paused||running||disposed)return;
   idle=clock.setTimeout(flush,idleMs);if(deadline===null)deadline=clock.setTimeout(flush,maxMs);
  }
  function schedule(){
   if(disposed)return;
   revision++;dirty=true;paused=false;onState('dirty');arm();
  }
  return {schedule,flush,pause(){paused=true;clear();},get dirty(){return dirty;},get saving(){return running!==null;},composition(active){composing=active;if(active)clear();else if(dirty)arm();},destroy(){disposed=true;clear();}};
 };
})();
