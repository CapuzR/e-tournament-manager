export const idlFactory = ({ IDL }) => {
  const Property = IDL.Rec();
  const Property__1 = IDL.Rec();
  const Value = IDL.Rec();
  const Value__1 = IDL.Rec();
  const InitOptions = IDL.Record({ 'admins' : IDL.Vec(IDL.Principal) });
  const Checkbox = IDL.Record({ 'options' : IDL.Vec(IDL.Text) });
  const FieldType = IDL.Variant({
    'TextField' : IDL.Text,
    'Range' : IDL.Vec(IDL.Nat),
    'Checkbox' : Checkbox,
  });
  const FilterDetails = IDL.Record({ 'kind' : FieldType, 'name' : IDL.Text });
  const Filter = IDL.Variant({
    'BountyRush' : IDL.Vec(FilterDetails),
    'Traits' : IDL.Vec(FilterDetails),
    'ElementumGeneral' : IDL.Vec(FilterDetails),
  });
  const CardCollectionArgs = IDL.Record({
    'filters' : IDL.Vec(Filter),
    'loreContext' : IDL.Text,
    'collectionId' : IDL.Text,
    'kind' : IDL.Text,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'batchUpdate' : IDL.Bool,
    'haveMultipleAC' : IDL.Bool,
    'standard' : IDL.Text,
  });
  Value.fill(
    IDL.Variant({
      'Int' : IDL.Int,
      'Nat' : IDL.Nat,
      'Nat16' : IDL.Nat16,
      'Nat32' : IDL.Nat32,
      'Nat64' : IDL.Nat64,
      'Blob' : IDL.Vec(IDL.Nat8),
      'Bool' : IDL.Bool,
      'Int8' : IDL.Int8,
      'Nat8' : IDL.Nat8,
      'Text' : IDL.Text,
      'Bytes' : IDL.Vec(IDL.Nat8),
      'Int16' : IDL.Int16,
      'Int32' : IDL.Int32,
      'Int64' : IDL.Int64,
      'Option' : IDL.Opt(Value),
      'Float' : IDL.Float64,
      'Principal' : IDL.Principal,
      'Array' : IDL.Vec(Value),
      'Class' : IDL.Vec(Property),
    })
  );
  Property.fill(IDL.Record({ 'value' : Value, 'name' : IDL.Text }));
  const CardStats = IDL.Variant({
    'BountyRush' : IDL.Vec(Property),
    'Traits' : IDL.Vec(Property),
    'ElementumGeneral' : IDL.Vec(Property),
  });
  const CardArgs = IDL.Record({
    'id' : IDL.Text,
    'url' : IDL.Text,
    'thumbnail' : IDL.Text,
    'collectionId' : IDL.Text,
    'mimeType' : IDL.Text,
    'stats' : IDL.Vec(CardStats),
    'index' : IDL.Nat,
    'collectionName' : IDL.Text,
  });
  const CardCollectionError = IDL.Variant({
    'CardCollectionAlreadyExists' : IDL.Null,
    'NotAuthorized' : IDL.Null,
    'Unknown' : IDL.Text,
    'NonExistentCardCollection' : IDL.Null,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : CardCollectionError });
  const Error = IDL.Variant({ 'NotAuthorized' : IDL.Null });
  const Result_6 = IDL.Variant({ 'ok' : IDL.Null, 'err' : Error });
  const CardError = IDL.Variant({
    'NotAuthorized' : IDL.Null,
    'Unknown' : IDL.Text,
    'CardAlreadyExists' : IDL.Null,
    'NonExistentCard' : IDL.Null,
  });
  const Result_5 = IDL.Variant({ 'ok' : IDL.Null, 'err' : CardError });
  const CardSuccess = IDL.Record({
    'id' : IDL.Text,
    'url' : IDL.Text,
    'thumbnail' : IDL.Text,
    'mimeType' : IDL.Text,
    'stats' : IDL.Vec(CardStats),
    'index' : IDL.Nat,
    'collectionName' : IDL.Text,
  });
  const CardCollectionSuccess = IDL.Record({
    'filters' : IDL.Vec(Filter),
    'loreContext' : IDL.Text,
    'collectionId' : IDL.Text,
    'cards' : IDL.Vec(CardSuccess),
    'kind' : IDL.Text,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'haveMultipleAC' : IDL.Bool,
    'standard' : IDL.Text,
  });
  const Result_2 = IDL.Variant({
    'ok' : IDL.Vec(CardCollectionSuccess),
    'err' : CardCollectionError,
  });
  Value__1.fill(
    IDL.Variant({
      'Int' : IDL.Int,
      'Nat' : IDL.Nat,
      'Nat16' : IDL.Nat16,
      'Nat32' : IDL.Nat32,
      'Nat64' : IDL.Nat64,
      'Blob' : IDL.Vec(IDL.Nat8),
      'Bool' : IDL.Bool,
      'Int8' : IDL.Int8,
      'Nat8' : IDL.Nat8,
      'Text' : IDL.Text,
      'Bytes' : IDL.Vec(IDL.Nat8),
      'Int16' : IDL.Int16,
      'Int32' : IDL.Int32,
      'Int64' : IDL.Int64,
      'Option' : IDL.Opt(Value__1),
      'Float' : IDL.Float64,
      'Principal' : IDL.Principal,
      'Array' : IDL.Vec(Value__1),
      'Class' : IDL.Vec(Property__1),
    })
  );
  Property__1.fill(IDL.Record({ 'value' : Value__1, 'name' : IDL.Text }));
  const CardStats__1 = IDL.Variant({
    'BountyRush' : IDL.Vec(Property__1),
    'Traits' : IDL.Vec(Property__1),
    'ElementumGeneral' : IDL.Vec(Property__1),
  });
  const Card = IDL.Record({
    'url' : IDL.Text,
    'thumbnail' : IDL.Text,
    'collectionId' : IDL.Text,
    'mimeType' : IDL.Text,
    'stats' : IDL.Vec(CardStats__1),
    'index' : IDL.Nat,
    'collectionName' : IDL.Text,
  });
  const Result_4 = IDL.Variant({ 'ok' : Card, 'err' : CardError });
  const Result_3 = IDL.Variant({
    'ok' : CardCollectionSuccess,
    'err' : CardCollectionError,
  });
  const UpdateCardError = IDL.Variant({
    'NotAuthorized' : IDL.Null,
    'Unknown' : IDL.Text,
    'NonExistentCard' : IDL.Null,
  });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Null, 'err' : UpdateCardError });
  const anon_class_13_1 = IDL.Service({
    'addCardCollection' : IDL.Func(
        [CardCollectionArgs, IDL.Vec(CardArgs)],
        [Result],
        [],
      ),
    'addNewAdmin' : IDL.Func([IDL.Vec(IDL.Principal)], [Result_6], []),
    'deleteCard' : IDL.Func([IDL.Text], [Result_5], []),
    'deleteCardCollection' : IDL.Func([IDL.Text], [Result], []),
    'getAllCollections' : IDL.Func([], [Result_2], ['query']),
    'getCard' : IDL.Func([CardArgs], [Result_4], ['query']),
    'getCardCollection' : IDL.Func([IDL.Text], [Result_3], ['query']),
    'getCollectionsByQuery' : IDL.Func([IDL.Text], [Result_2], ['query']),
    'testQueryA' : IDL.Func([CardCollectionArgs], [], []),
    'testQueryB' : IDL.Func([IDL.Vec(CardArgs)], [], []),
    'updateCard' : IDL.Func([CardArgs], [Result_1], []),
    'updateCardCollection' : IDL.Func(
        [CardCollectionArgs, IDL.Vec(CardArgs)],
        [Result],
        [],
      ),
  });
  return anon_class_13_1;
};
export const init = ({ IDL }) => {
  const InitOptions = IDL.Record({ 'admins' : IDL.Vec(IDL.Principal) });
  return [InitOptions];
};
