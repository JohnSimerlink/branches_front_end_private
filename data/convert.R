library(jsonlite)
document <- fromJSON(txt='C:\\Users\\John\\Dev\\branches_front_end\\data\\john_interactions.json')
i = 1
table <- data.frame("item"=integer(), "proficiency" = integer(), "timestamp" = integer())
for (item in document){

  itemId = sample(1:999999, 1)

  interactions <- item['interactions'][[1]]
  proficiencies <- interactions['proficiency'][[1]]
  timestamps <- interactions['timestamp'][[1]]
  for (j in 1:length(proficiencies)){

    table[nrow(table) + 1,] = c(itemId, proficiencies[[j]], timestamps[[j]])

  }
}
write.csv(table, "john_interactions.csv")