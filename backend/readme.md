# Brabopak Scanner App backend

## voor de picking is de API call :
 
```js
var response = await GetClient()
  .PostAsync($"DeliveryNote/AfterPicking?bookyear={bookyear}&dnNumber={dnNumber}&pinCode={pincode}&collies={collies}&location={location}", null)
```
 
 
## voor transport :
 
```js
var response = await GetClient()
  .PostAsync($"DeliveryNote/Transport?bookyear={bookyear}&dnNumber={dnNumber}&pinCode={pincode}", null);
```