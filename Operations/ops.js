
// Functions to export
module.exports  = {
    // Function for Restructuring JSON gets two objects and retruns Normalized object
    restructure:  function(petOwners, pets) {
      var OwnerPets = []
      for ( const petOwner of petOwners ) {
            var petsOfOwner = []
        for ( const pet of pets ) {
            if ( pet.petOwnerId === petOwner.id )
              {
                petsOfOwner.push(pet.name)          
              }
        }
        var OwnerPet = {
                          "id" : petOwner.id,
                          "firstName" : petOwner.firstName,
                          "lastName" : petOwner.lastName,
                          "phone" : petOwner.phone,
                          "petName" : petsOfOwner
                        }
      OwnerPets.push(OwnerPet)
      }
      return OwnerPets
    }

}